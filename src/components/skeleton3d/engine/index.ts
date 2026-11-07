import { Box3, Color, Group, LoaderUtils, Matrix4, PerspectiveCamera, Scene, WebGLRenderer, type Material } from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { refKey, resolveParts } from "../names";
import type { Effect, IdleTour, MeshRef, ScenarioDef, TubeDef } from "../types";
import type { DracoFiles } from "../assets";
import { CAMERA_PRESETS, CameraRig, REST_PRESET, poseFor } from "./camera";
import { createEffect, type EffectCtx, type EffectInstance } from "./effects";
import { COLORS, createSharedUniforms } from "./materials";
import { buildParts, buildTube, type Part } from "./parts";

/**
 * Motor del esqueleto rayos X (en tinta, sobre fondo claro). Se carga con import() dinámico desde
 * Skeleton3D, así three.js nunca entra al bundle inicial.
 *
 * Render bajo demanda: el ciclo solo corre mientras hay algo que mover
 * (viaje de cámara, tinte que cambia, latido, efecto, recorrido guiado) y se
 * detiene en reposo, en pausa, fuera de pantalla o con la pestaña oculta.
 */

export type EngineOptions = {
  /** Contenedor donde se inserta el canvas (lo ocupa al 100 %). */
  container: HTMLElement;
  /** URL del .glb (base para resolver rutas relativas dentro del modelo). */
  modelSrc: string;
  /** Contenido del .glb, ya en descarga desde antes de cargar three.js. */
  model: Promise<ArrayBuffer>;
  /** Decodificador Draco descargado en paralelo (null = lo pide el motor). */
  decoder?: Promise<DracoFiles> | null;
  quality: "high" | "low";
  interactive: boolean;
  extraTubes?: readonly TubeDef[];
  /** Recorrido guiado de reposo (opcional). */
  idleTour?: IdleTour | null;
  /** Arranca en pausa. */
  paused?: boolean;
  /** Ruta del decodificador Draco (copiado en public/draco/). */
  dracoPath?: string;
  /** Se perdió el contexto WebGL (memoria, GPU): mostrar la imagen fija. */
  onContextLost?: () => void;
  /** El navegador devolvió el contexto: el 3D vuelve a dibujarse. */
  onContextRestored?: () => void;
};

export type SkeletonEngine = {
  setScenario(s: ScenarioDef | null): void;
  setInteractive(on: boolean): void;
  setIdleTour(t: IdleTour | null): void;
  setPaused(p: boolean): void;
  dispose(): void;
};

const PAIN_IN = 7.5; // ~400 ms al 95 %
const PAIN_OUT = 6; // ~500 ms al 95 %
// Respuesta del spring de cámara (s). Más de 90° de giro: 0.7 s (camera.ts).
const SCENARIO_RESPONSE = 0.55;
const REST_RESPONSE = 0.5;
const TOUR_RESPONSE = 1.1;
const PULSE_PERIOD = 1.1; // s, latido
/** Profundidad del latido cuando el escenario trae un efecto con ritmo propio. */
const PULSE_UNDER_FX = 0.35;
const DEPTH_RATE = 6;
const SPIN_SPEED = (Math.PI * 2) / 60; // ~1 vuelta por minuto (solo paradas con "spin")
const TONE_RATE = 6; // cambio de tono dolor ↔ calm, ~500 ms
const TOUR_DWELL = 2.4; // s de estancia por parada (tras el viaje)
const TOUR_START = 2.5; // s en reposo antes de la primera parada
const TOUR_RESUME = 4; // s tras sacar el puntero del lienzo
const PAIN_COLOR = new Color(COLORS.pain);
const CALM_COLOR = new Color(COLORS.calm);

/** Suavizado exponencial interrumpible; con dt = ∞ llega de golpe (pausa). */
const approach = (dt: number, rate: number) => 1 - Math.exp(-dt * rate);

/** ¿El efecto tiene un ritmo propio (todo menos el abultamiento al latido)? */
const hasOwnRhythm = (fx: readonly Effect[]) => fx.some((f) => f.type !== "bulge");

export async function createSkeletonEngine(opts: EngineOptions): Promise<SkeletonEngine> {
  const { container } = opts;
  const high = opts.quality === "high";

  // El canvas lo crea el motor (no React): al desmontar se descarta con su
  // contexto WebGL y un montaje nuevo nunca hereda un contexto perdido.
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  // width/height explícitos: sin ellos el canvas toma su tamaño intrínseco
  // (ancho × devicePixelRatio) y en pantallas HiDPI se desborda (bug de la demo).
  Object.assign(canvas.style, { display: "block", width: "100%", height: "100%" });

  // Aquí se detecta si hay WebGL (sin contexto de prueba aparte): si falla,
  // Skeleton3D se queda con la imagen fija.
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: high,
      alpha: true,
      powerPreference: high ? "high-performance" : "low-power",
    });
  } catch (e) {
    throw new Error(`WebGL no disponible: ${String(e)}`);
  }
  renderer.setClearColor(0x000000, 0);
  const dprCap = high ? 2 : 1.5;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.01, 20);
  const rig = new CameraRig(camera);
  const shared = createSharedUniforms();
  const root = new Group();
  scene.add(root);

  let disposed = false;
  const cleanup: (() => void)[] = [];

  // Pérdida del contexto (memoria del celular, GPU reiniciada): sin esto el
  // escenario queda vacío. preventDefault permite que el navegador lo
  // devuelva; three.js rehace su estado y se vuelve a dibujar.
  let contextLost = false;
  // Ya terminó de cargar y corre el ciclo de render.
  let running = false;
  let raf = 0;
  const onLost = (e: Event) => {
    e.preventDefault();
    if (disposed) return;
    contextLost = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    opts.onContextLost?.();
  };
  const onRestored = () => {
    if (disposed) return;
    contextLost = false;
    if (!running) return;
    opts.onContextRestored?.();
    wake();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  cleanup.push(() => {
    canvas.removeEventListener("webglcontextlost", onLost);
    canvas.removeEventListener("webglcontextrestored", onRestored);
  });

  function disposeGpu() {
    scene.traverse((o) => {
      const m = o as unknown as { geometry?: { dispose(): void }; material?: Material | Material[] };
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => mat.dispose());
    });
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  // ── Carga del modelo ──────────────────────────────────────────────────
  // El .glb y el decodificador ya vienen en camino (assets.ts). Con los
  // archivos de Draco en memoria se le pasan como URLs blob: los workers
  // arrancan sin otra petición y mientras el .glb termina de bajar.
  const draco = new DRACOLoader();
  draco.setDecoderPath(opts.dracoPath ?? "/draco/");
  const blobUrls: string[] = [];
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  let parts: Part[];
  try {
    if (opts.decoder) {
      try {
        const d = await opts.decoder;
        const js = URL.createObjectURL(new Blob([d.js], { type: "text/javascript" }));
        const wasm = URL.createObjectURL(new Blob([d.wasm], { type: "application/wasm" }));
        blobUrls.push(js, wasm);
        draco.setDecoderPath({ js, wasm });
      } catch {
        // Sin la descarga previa, DRACOLoader pide los archivos por su ruta.
      }
    }
    draco.preload();
    const data = await opts.model;
    const gltf = await loader.parseAsync(data, LoaderUtils.extractUrlBase(opts.modelSrc));
    root.add(gltf.scene);
    parts = buildParts(gltf.scene, shared);
    for (const def of opts.extraTubes ?? []) parts.push(buildTube(def, root, shared));
  } catch (e) {
    disposed = true;
    cleanup.forEach((fn) => fn());
    draco.dispose();
    blobUrls.forEach((u) => URL.revokeObjectURL(u));
    disposeGpu();
    throw e;
  }
  // Libera los workers del decodificador: ya no se necesitan.
  draco.dispose();
  blobUrls.forEach((u) => URL.revokeObjectURL(u));

  const tubes = parts.filter((p) => p.kind === "tube");
  const bounds = new Box3();
  for (const p of parts) if (p.kind !== "tube") bounds.union(p.box);
  rig.setBounds(bounds);

  // ── Resolución de nombres (con caché por referencia) ──────────────────
  const refCache = new Map<string, Part[]>();
  function resolve(ref: MeshRef): Part[] {
    const k = refKey(ref);
    let hit = refCache.get(k);
    if (!hit) {
      hit = resolveParts(parts, ref);
      refCache.set(k, hit);
    }
    return hit;
  }

  // ── Estado ────────────────────────────────────────────────────────────
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mqFine = matchMedia("(pointer: fine)");
  let reduced = mqReduce.matches;
  let interactive = opts.interactive;
  // `scenario` = lo que se muestra (escenario del usuario o parada del
  // recorrido); `userScenario` = lo que pidió la página (null = reposo).
  let scenario: ScenarioDef | null = null;
  let userScenario: ScenarioDef | null = null;
  let restAz = 0;
  // Recorrido guiado (D1): una vuelta por visita. Parada actual (−1 = aún en
  // reposo), segundos para la siguiente y si ya terminó.
  let tour: IdleTour | null = opts.idleTour ?? null;
  let tourIdx = -1;
  let tourWait = tour?.startDelay ?? TOUR_START;
  let tourDone = false;
  // Primera interacción del usuario: el recorrido ya no vuelve en esta visita.
  let interacted = false;
  let hovering = false;
  // Pausa (WCAG 2.2.2): reloj congelado y sin ciclo de render. Lo que cambie
  // en pausa se aplica de golpe en un solo cuadro (`pendingSnap`).
  let paused = opts.paused ?? false;
  let pendingSnap = false;
  if (paused) interacted = true;
  let instances: EffectInstance[] = [];
  const touchedTint = new Set<Part>();
  const dynTint = new Map<Part, number>();
  let time = 0;
  // Profundidad del latido: baja al 35 % si el efecto trae su propio ritmo.
  let pulseDepth = 1;
  let pulseDepthTarget = 1;
  let onscreen = true;
  let hidden = document.hidden;
  let dragging = false;
  // Corte con fundido (reducir movimiento): 1 → 0, cambia cámara, 0 → 1.
  let cut: { phase: "out" | "in"; apply: () => void } | null = null;

  const _tmp = new Matrix4();
  const ctx: EffectCtx = {
    time: 0,
    reduced,
    pulse01: 0.5,
    resolve,
    deform(part, m) {
      part.delta.premultiply(m);
      part.deformed = true;
    },
    tint(part, strength) {
      dynTint.set(part, Math.max(dynTint.get(part) ?? 0, strength));
      part.toneTarget = scenario?.tone === "calm" ? 1 : 0;
      touchedTint.add(part);
    },
  };

  // ── Lienzo y tamaño ───────────────────────────────────────────────────
  container.appendChild(canvas);
  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    rig.refit();
    wake();
  }

  // ── Escenarios ────────────────────────────────────────────────────────
  /**
   * Muestra un escenario (del usuario o del recorrido); null = reposo.
   * `response`: segundos del spring de cámara para este viaje.
   */
  function show(next: ScenarioDef | null, response = next ? SCENARIO_RESPONSE : REST_RESPONSE) {
    if (disposed) return;
    if (next === scenario || (next && scenario && next.id === scenario.id)) return;
    const wasRest = scenario === null;
    if (wasRest) restAz = rig.azimuth;
    scenario = next;

    // Tinte estático: destino por pieza (el máximo si aparece varias veces).
    const tone = next?.tone === "calm" ? 1 : 0;
    for (const p of touchedTint) p.painTarget = 0;
    for (const t of next?.tint ?? []) {
      for (const p of resolve(t.mesh)) {
        p.painTarget = Math.max(p.painTarget, Math.min(1, Math.max(0, t.strength)));
        // Una pieza que entra desde cero toma el tono nuevo de inmediato;
        // si ya estaba encendida, el color se mezcla (sin saltos).
        if (p.pain < 0.01) {
          p.tone = tone;
          p.u.uPainColor.value.lerpColors(PAIN_COLOR, CALM_COLOR, tone);
          p.u.uTone.value = tone;
        }
        p.toneTarget = tone;
        touchedTint.add(p);
        if (t.at) {
          const c = rig.toModel(t.at);
          p.u.uHot.value.set(c.x, c.y, c.z, (t.radius ?? 0.04) * rig.modelScale);
        } else {
          p.u.uHot.value.w = 0;
        }
      }
    }

    // Cámara: al reposo vuelve al azimut donde se dejó. En pausa salta de
    // golpe; con "reducir movimiento", corte con fundido.
    const pose = next ? poseFor(next.camera) : CAMERA_PRESETS[REST_PRESET];
    const azOverride = next ? undefined : restAz;
    let lead = 0;
    if (paused) {
      cut = null;
      shared.uMaster.value = 1;
      rig.go(pose, 0, azOverride);
      pendingSnap = true;
    } else if (reduced) {
      cut = { phase: "out", apply: () => rig.go(pose, 0, azOverride) };
    } else {
      // El gesto de cada efecto espera a que la cámara llegue.
      lead = rig.go(pose, response, azOverride);
    }

    // Efectos: los actuales salen con su envolvente; los nuevos entran. Si
    // uno de los que va saliendo es el mismo (A→B→A), vuelve desde donde va.
    for (const inst of instances) inst.target = 0;
    const list: readonly Effect[] = next?.effect ? (Array.isArray(next.effect) ? next.effect : [next.effect]) : [];
    ctx.time = time;
    for (const fx of list) {
      const back = instances.find((i) => i.def === fx && !i.still);
      if (back) {
        back.target = 1;
      } else {
        const inst = createEffect(fx, ctx, lead);
        inst.still = paused;
        instances.push(inst);
      }
    }
    pulseDepthTarget = hasOwnRhythm(list) ? PULSE_UNDER_FX : 1;
    wake();
  }

  /** Escenario pedido por la página. null = reposo (vista general quieta). */
  function setScenario(next: ScenarioDef | null) {
    if (disposed) return;
    if (next === null && userScenario === null) return;
    userScenario = next;
    // Hover, foco o scroll-spy: el recorrido terminó para esta visita.
    if (next) interacted = true;
    show(next);
  }

  /** Puntero sobre el lienzo: la parada sigue `resumeDelay` s después de salir. */
  function holdTour() {
    tourWait = Math.max(tourWait, tour?.resumeDelay ?? TOUR_RESUME);
  }

  function tourRunning() {
    return (
      !!tour && tour.stops.length > 0 && !tourDone && !interacted && !reduced && !paused && userScenario === null
    );
  }

  function setIdleTour(next: IdleTour | null) {
    if (disposed) return;
    tour = next;
    tourIdx = -1;
    tourWait = next?.startDelay ?? TOUR_START;
    tourDone = false;
    // Una parada en pantalla vuelve al reposo; el recorrido nuevo empieza ahí.
    if (userScenario === null && scenario !== null) show(null);
    wake();
  }

  /** Pausa: congela todo y detiene el render; al reanudar sigue desde ahí. */
  function setPaused(next: boolean) {
    if (disposed || next === paused) return;
    paused = next;
    if (paused) {
      interacted = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      return;
    }
    pendingSnap = false;
    // Lo que entró en pausa estaba fijo: pasa a animarse con un fundido de
    // envolventes (sin salto) y con la cámara ya en su lugar.
    ctx.time = time;
    for (const inst of [...instances]) {
      if (!inst.still || inst.target === 0) continue;
      inst.target = 0;
      instances.push(createEffect(inst.def, ctx, 0));
    }
    // La pausa cuenta como interacción: una parada del recorrido que quedó
    // congelada da paso a la vista general.
    if (userScenario === null && scenario !== null) show(null);
    wake();
  }

  // ── Arrastre (solo puntero fino; el dedo sigue haciendo scroll) ───────
  let lastX = 0;
  let lastY = 0;
  let lastMove = 0;
  function canDrag(e: PointerEvent) {
    return interactive && !paused && e.pointerType !== "touch" && mqFine.matches && e.button === 0;
  }
  // Puntero sobre el lienzo (PC): el recorrido se queda en la parada actual.
  function onEnter(e: PointerEvent) {
    if (e.pointerType === "touch" || !mqFine.matches) return;
    hovering = true;
  }
  function onLeave() {
    if (!hovering) return;
    hovering = false;
    holdTour();
    wake();
  }
  function onDown(e: PointerEvent) {
    if (!canDrag(e)) return;
    dragging = true;
    interacted = true;
    lastX = e.clientX;
    lastY = e.clientY;
    lastMove = performance.now();
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
    wake();
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dt = Math.max(1 / 240, (now - lastMove) / 1000);
    lastX = e.clientX;
    lastY = e.clientY;
    lastMove = now;
    rig.drag(-dx * 0.008, dy * 0.005, dt);
    wake();
  }
  function onUp(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = interactive ? "grab" : "";
    // Si el puntero llevaba quieto un rato, soltar no lanza inercia.
    rig.release(performance.now() - lastMove <= 80);
    wake();
  }
  function setInteractive(on: boolean) {
    interactive = on;
    canvas.style.cursor = on && mqFine.matches ? "grab" : "";
  }
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerenter", onEnter);
  canvas.addEventListener("pointerleave", onLeave);
  setInteractive(interactive);

  // ── Ciclo de render bajo demanda ──────────────────────────────────────
  let last = 0;
  let lastRender = 0;
  // Pedido de dibujar al menos un cuadro (tamaño, visibilidad, cambios).
  let needRender = false;

  function wake() {
    needRender = true;
    if (disposed || raf || !onscreen || hidden || contextLost) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  /**
   * Avanza el estado. Devuelve 2 si hay que dibujar y seguir, 1 si solo
   * corre el reloj del recorrido (sin cambios en pantalla) y 0 en reposo.
   * `snap`: todo llega a su destino de golpe y el reloj no avanza (pausa).
   */
  function update(dt: number, snap = false): 0 | 1 | 2 {
    // Paso de los suavizados exponenciales: infinito = llegar de golpe.
    const sdt = snap ? Infinity : dt;
    if (!snap) time += dt;
    let busy = false;
    let tick = false;

    // Corte con fundido (reducir movimiento).
    if (cut) {
      busy = true;
      if (cut.phase === "out") {
        shared.uMaster.value = Math.max(0, shared.uMaster.value - dt / 0.15);
        if (shared.uMaster.value === 0) {
          cut.apply();
          cut.phase = "in";
        }
      } else {
        shared.uMaster.value = Math.min(1, shared.uMaster.value + dt / 0.25);
        if (shared.uMaster.value === 1) cut = null;
      }
    }

    // Recorrido guiado: avanza solo en reposo, sin arrastre ni puntero encima.
    // La estancia cuenta desde que sale hacia la parada (viaje + dwell).
    if (tourRunning() && !dragging && !hovering && !cut && tour) {
      tick = true;
      tourWait -= dt;
      if (tourWait <= 0) {
        const nextIdx = tourIdx + 1;
        if (nextIdx >= tour.stops.length && !tour.loop) {
          // Una sola vuelta (D1): queda la vista general quieta.
          tourDone = true;
          show(null);
        } else {
          tourIdx = nextIdx % tour.stops.length;
          const stop = tour.stops[tourIdx];
          show(stop, TOUR_RESPONSE);
          tourWait = TOUR_RESPONSE + (stop.dwell ?? TOUR_DWELL);
        }
      }
    }

    // Cámara: spring, inercia y giro lento de las paradas con "spin". El
    // reposo queda quieto (D1) y el vaivén ya no existe.
    if (snap) {
      rig.apply();
    } else {
      if (rig.update(dt, dragging)) busy = true;
      const spin = scenario?.motion === "spin";
      if (spin && !reduced && !dragging && !rig.transitioning && !cut) {
        rig.spin(SPIN_SPEED * dt);
        rig.apply();
        busy = true;
      }
    }

    // Latido común (más tenue si el efecto trae su propio ritmo).
    const dd = pulseDepthTarget - pulseDepth;
    if (Math.abs(dd) > 0.002) {
      pulseDepth += dd * approach(sdt, DEPTH_RATE);
    } else {
      pulseDepth = pulseDepthTarget;
    }
    const pulse01 = reduced ? 0.5 : 0.5 + 0.5 * pulseDepth * Math.sin((time * Math.PI * 2) / PULSE_PERIOD);
    shared.uPulse.value = pulse01;

    // Efectos: reinicia los uniforms de efecto y la deformación de este cuadro.
    for (const inst of instances) for (const p of inst.parts) p.u.uFlash.value = 0;
    for (const p of tubes) {
      p.u.uVisible.value = 0;
      p.u.uFlow.value = 0;
      p.u.uBreathe.value = 0;
      p.u.uPinch.value = 0;
    }
    for (const p of parts) {
      if (p.deformed) p.delta.identity();
      p.wasDeformed = p.deformed;
      p.deformed = false;
    }
    dynTint.clear();
    ctx.time = time;
    ctx.pulse01 = pulse01;
    const alive: EffectInstance[] = [];
    for (const inst of instances) {
      // Una instancia creada en pausa se dibuja fija, como con reducir movimiento.
      ctx.reduced = reduced || inst.still;
      if (inst.stepEnv(sdt)) busy = true;
      if (inst.apply(ctx)) busy = true;
      if (!inst.dead) alive.push(inst);
    }
    ctx.reduced = reduced;
    instances = alive;

    // Matrices: reposo + deformación del cuadro (o regreso exacto al reposo).
    for (const p of parts) {
      if (p.deformed) {
        // L' = P⁻¹ · Δ · P · L
        _tmp.multiplyMatrices(p.delta, p.parentWorld).premultiply(p.parentInv);
        p.mesh.matrix.multiplyMatrices(_tmp, p.rest);
        p.mesh.matrixWorldNeedsUpdate = true;
      } else if (p.wasDeformed) {
        p.mesh.matrix.copy(p.rest);
        p.mesh.matrixWorldNeedsUpdate = true;
      }
    }

    // Tinte: suavizado exponencial (interrumpible) hacia el destino.
    let anyPain = false;
    for (const p of touchedTint) {
      const target = Math.max(p.painTarget, dynTint.get(p) ?? 0);
      const d = target - p.pain;
      if (Math.abs(d) < 0.002) {
        p.pain = target;
        if (target === 0 && !dynTint.has(p) && p.painTarget === 0) {
          touchedTint.delete(p);
          p.u.uHot.value.w = 0;
        }
      } else {
        p.pain += d * approach(sdt, d > 0 ? PAIN_IN : PAIN_OUT);
        busy = true;
      }
      // Tono dolor ↔ calm: mezcla suave del color de esta pieza.
      if (p.tone !== p.toneTarget) {
        const dt2 = p.toneTarget - p.tone;
        p.tone = Math.abs(dt2) < 0.002 ? p.toneTarget : p.tone + dt2 * approach(sdt, TONE_RATE);
        p.u.uPainColor.value.lerpColors(PAIN_COLOR, CALM_COLOR, p.tone);
        p.u.uTone.value = p.tone;
        busy = true;
      }
      p.u.uPain.value = p.pain;
      if (p.pain > 0.001) anyPain = true;
      // Un tubo con tinte también se ve.
      if (p.kind === "tube") p.u.uVisible.value = Math.max(p.u.uVisible.value, p.pain);
    }
    // Con dolor en pantalla el latido sigue (y con él, el render).
    if (anyPain && !reduced) busy = true;

    // Tubos apagados no se dibujan.
    for (const p of tubes) {
      const u = p.u;
      p.mesh.visible = u.uVisible.value > 0.002 || u.uFlow.value > 0.002 || u.uBreathe.value > 0.002;
    }
    return busy ? 2 : tick ? 1 : 0;
  }

  function frame(now: number) {
    raf = 0;
    if (disposed || !onscreen || hidden || contextLost) return;
    if (paused) {
      // En pausa: un solo cuadro fijo, sin programar el siguiente.
      if (pendingSnap) {
        update(0, true);
        pendingSnap = false;
      } else {
        rig.apply();
      }
      renderer.render(scene, camera);
      needRender = false;
      return;
    }
    // Calidad baja: tope de ~30 fps salvo durante viajes de cámara.
    if (!high && !rig.transitioning && !needRender && now - lastRender < 31) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    const state = update(dt);
    if (state === 2 || needRender) {
      renderer.render(scene, camera);
      lastRender = now;
    }
    needRender = false;
    // Una sola cadena de cuadros: show() → wake() dentro de update() ya pudo
    // programar el siguiente (antes esto duplicaba el ciclo en cada parada).
    if (state > 0 && raf === 0) raf = requestAnimationFrame(frame);
  }

  // ── Visibilidad: fuera de pantalla o pestaña oculta = sin render ──────
  const io = new IntersectionObserver(
    (entries) => {
      onscreen = entries.some((e) => e.isIntersecting);
      if (onscreen) wake();
    },
    { threshold: 0 },
  );
  io.observe(container);
  const onVis = () => {
    hidden = document.hidden;
    if (!hidden) wake();
  };
  document.addEventListener("visibilitychange", onVis);
  const onReduce = () => {
    reduced = mqReduce.matches;
    // Con "reducir movimiento" no hay recorrido: vuelve a la vista general.
    if (reduced && userScenario === null && scenario !== null) show(null);
    wake();
  };
  mqReduce.addEventListener("change", onReduce);
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  cleanup.push(
    () => io.disconnect(),
    () => ro.disconnect(),
    () => document.removeEventListener("visibilitychange", onVis),
    () => mqReduce.removeEventListener("change", onReduce),
    () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    },
  );

  // Pose inicial y compilación de shaders antes del primer cuadro (evita un
  // tirón al aparecer).
  resize();
  rig.go(CAMERA_PRESETS[REST_PRESET], 0);
  rig.apply();
  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    // compileAsync es una optimización; si falla se compila en el primer render.
  }
  if (contextLost) {
    // Se perdió el contexto durante la carga: Skeleton3D cae a la imagen fija.
    disposed = true;
    cleanup.forEach((fn) => fn());
    disposeGpu();
    throw new Error("Contexto WebGL perdido durante la carga");
  }
  running = true;
  renderer.render(scene, camera);
  wake();

  return {
    setScenario,
    setInteractive,
    setIdleTour,
    setPaused,
    dispose() {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      cleanup.forEach((fn) => fn());
      disposeGpu();
    },
  };
}
