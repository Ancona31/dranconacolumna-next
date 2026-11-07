import { Matrix4, Quaternion, Vector3 } from "three";
import type { Direction, Effect, MeshRef, TintSpec } from "../types";
import type { Part } from "./parts";

/**
 * Efectos genéricos por padecimiento. Cada efecto activo es una "instancia"
 * con una envolvente `env` (0..1) que sube al entrar y baja al salir: así un
 * cambio rápido de escenario mezcla el efecto que se va con el que llega, sin
 * saltos. Las deformaciones se expresan como matrices en espacio del modelo
 * (metros) que el motor compone sobre la pose de reposo de cada pieza.
 *
 * Ritmo: todos los periodos por defecto son múltiplos del latido (1.1 s),
 * así el efecto y el pulso no se cruzan. El gesto anatómico (golpe, curva,
 * deslizamiento) espera `lead` s a que la cámara llegue; la envolvente y el
 * tinte sí entran de inmediato, junto con el viaje.
 */

export type EffectCtx = {
  /** Segundos desde que arrancó el motor. */
  time: number;
  reduced: boolean;
  /** Latido 0..1 (~1.1 s). */
  pulse01: number;
  resolve(ref: MeshRef): Part[];
  /** Acumula una deformación (espacio del modelo) para la pieza en este cuadro. */
  deform(part: Part, m: Matrix4): void;
  /** Tinte dinámico de este cuadro (lo usa "sequence"). */
  tint(part: Part, strength: number): void;
};

const AXES: Record<Exclude<Direction, readonly number[]>, Vector3> = {
  anterior: new Vector3(0, 0, 1),
  posterior: new Vector3(0, 0, -1),
  superior: new Vector3(0, 1, 0),
  inferior: new Vector3(0, -1, 0),
  left: new Vector3(1, 0, 0),
  right: new Vector3(-1, 0, 0),
};

export function dirVector(d: Direction): Vector3 {
  if (typeof d === "string") return AXES[d].clone();
  return new Vector3(d[0], d[1], d[2]).normalize();
}

const TAU = Math.PI * 2;
const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};
/** Oscilación 0 → 1 → 0 suave. */
const osc = (t: number, period: number) => 0.5 - 0.5 * Math.cos((TAU * t) / period);

// Temporales reutilizados (sin asignaciones por cuadro).
const _m = new Matrix4();
const _a = new Matrix4();
const _b = new Matrix4();
const _v = new Vector3();
const _q = new Quaternion();
const _qz = new Quaternion();
const Y = new Vector3(0, 1, 0);
const Z = new Vector3(0, 0, 1);

/** Escala `s` a lo largo del eje unitario `n` alrededor del punto `p`. */
function stretchAbout(out: Matrix4, n: Vector3, s: number, p: Vector3) {
  const k = s - 1;
  // I + k·n·nᵀ
  _a.set(
    1 + k * n.x * n.x, k * n.x * n.y, k * n.x * n.z, 0,
    k * n.y * n.x, 1 + k * n.y * n.y, k * n.y * n.z, 0,
    k * n.z * n.x, k * n.z * n.y, 1 + k * n.z * n.z, 0,
    0, 0, 0, 1,
  );
  out.makeTranslation(p.x, p.y, p.z).multiply(_a);
  _b.makeTranslation(-p.x, -p.y, -p.z);
  return out.multiply(_b);
}

/** Extensión de la caja de la pieza proyectada sobre `n`. */
function extentAlong(part: Part, n: Vector3) {
  const s = part.size;
  return Math.abs(n.x) * s.x + Math.abs(n.y) * s.y + Math.abs(n.z) * s.z;
}

export abstract class EffectInstance {
  env = 0;
  target = 1;
  readonly start: number;
  /**
   * Instancia creada con la animación en pausa: se dibuja en su estado
   * representativo fijo (como con "reducir movimiento").
   */
  still = false;

  constructor(
    /** Definición de origen: A→B→A reutiliza la instancia que va saliendo. */
    readonly def: Effect,
    ctx: EffectCtx,
    /** Segundos que el gesto espera a que llegue la cámara. */
    readonly lead: number,
  ) {
    this.start = ctx.time;
  }

  /** Segundos de fase del gesto (0 mientras la cámara viaja). */
  protected phaseTime(ctx: EffectCtx) {
    return Math.max(0, ctx.time - this.start - this.lead);
  }

  /** Avanza la envolvente; devuelve true mientras cambia. */
  stepEnv(dt: number): boolean {
    const d = this.target - this.env;
    if (Math.abs(d) < 0.002) {
      this.env = this.target;
      return false;
    }
    // ~500 ms para entrar o salir; exponencial = interrumpible.
    this.env += d * (1 - Math.exp(-dt * 6.5));
    return true;
  }

  get dead() {
    return this.target === 0 && this.env === 0;
  }

  /** Piezas con uniforms de efecto que hay que reiniciar cada cuadro. */
  abstract readonly parts: Part[];

  /** Aplica el cuadro; devuelve true si el efecto sigue animando. */
  abstract apply(ctx: EffectCtx): boolean;
}

class BulgeFx extends EffectInstance {
  readonly parts: Part[];
  private n: Vector3;
  constructor(
    private fx: Extract<Effect, { type: "bulge" }>,
    ctx: EffectCtx,
    lead: number,
  ) {
    super(fx, ctx, lead);
    this.parts = ctx.resolve(fx.mesh);
    this.n = dirVector(fx.direction);
  }
  apply(ctx: EffectCtx) {
    const pulsing = this.fx.pulse !== false && !ctx.reduced;
    const amt = this.fx.amount * this.env * (pulsing ? 0.45 + 0.55 * ctx.pulse01 : 1);
    for (const p of this.parts) {
      const ext = Math.max(extentAlong(p, this.n), 1e-4);
      // El lado opuesto queda fijo: el abultamiento crece solo hacia `n`.
      _v.copy(p.center).addScaledVector(this.n, -ext / 2);
      ctx.deform(p, stretchAbout(_m, this.n, 1 + amt / ext, _v));
    }
    return pulsing;
  }
}

class SlideFx extends EffectInstance {
  readonly parts: Part[];
  private n: Vector3;
  constructor(
    private fx: Extract<Effect, { type: "slide" }>,
    ctx: EffectCtx,
    lead: number,
  ) {
    super(fx, ctx, lead);
    this.parts = ctx.resolve(fx.mesh);
    this.n = dirVector(fx.direction);
  }
  apply(ctx: EffectCtx) {
    const k = ctx.reduced ? 1 : osc(this.phaseTime(ctx), this.fx.period ?? 3.3);
    const d = this.fx.amount * this.env * k;
    _m.makeTranslation(this.n.x * d, this.n.y * d, this.n.z * d);
    for (const p of this.parts) ctx.deform(p, _m);
    return !ctx.reduced;
  }
}

class CompressFx extends EffectInstance {
  readonly parts: Part[];
  private n: Vector3;
  constructor(
    private fx: Extract<Effect, { type: "compress" }>,
    ctx: EffectCtx,
    lead: number,
  ) {
    super(fx, ctx, lead);
    this.parts = ctx.resolve(fx.mesh);
    this.n = dirVector(fx.axis ?? "superior");
  }
  apply(ctx: EffectCtx) {
    const P = this.fx.period ?? 3.3;
    // Math.max en phaseTime: con t negativo el % daría una fase negativa.
    const t = this.phaseTime(ctx) % P;
    let k = 1;
    let flash = 0;
    if (!ctx.reduced) {
      // Golpe rápido (~0.2 s), sostiene, se recupera lento y pausa.
      const c = t / P;
      if (c < 0.065) k = 1 - (1 - c / 0.065) ** 3;
      else if (c < 0.6) k = 1;
      else if (c < 0.82) k = 1 - smooth((c - 0.6) / 0.22);
      else k = 0;
      if (this.fx.flash !== false) flash = Math.exp(-t / 0.18) * Math.min(1, t / 0.03);
    }
    const s = 1 - (this.fx.amount ?? 0.18) * k * this.env;
    for (const p of this.parts) {
      ctx.deform(p, stretchAbout(_m, this.n, s, p.center));
      p.u.uFlash.value = Math.max(p.u.uFlash.value, flash * this.env * 0.9);
    }
    return !ctx.reduced;
  }
}

class ScoliosisFx extends EffectInstance {
  readonly parts: Part[];
  private attach: Part[];
  private y0 = 0;
  private y1 = 1;
  constructor(
    private fx: Extract<Effect, { type: "scoliosis" }>,
    ctx: EffectCtx,
    lead: number,
  ) {
    super(fx, ctx, lead);
    // Copia: el arreglo de resolve() está en caché y no se ordena en sitio.
    this.parts = [...ctx.resolve(fx.mesh)].sort((a, b) => a.center.y - b.center.y);
    this.attach = fx.attach ? ctx.resolve(fx.attach) : [];
    if (this.parts.length) {
      this.y0 = this.parts[0].center.y;
      this.y1 = this.parts[this.parts.length - 1].center.y;
    }
  }
  private phase(ctx: EffectCtx) {
    if (ctx.reduced) return 1;
    const tm = this.fx.timing ?? {};
    const tin = tm.in ?? 1.1;
    const hold = tm.hold ?? 2.2;
    const out = tm.out ?? 1.1;
    const rest = tm.rest ?? 1.1;
    const t = this.phaseTime(ctx) % (tin + hold + out + rest);
    if (t < tin) return smooth(t / tin);
    if (t < tin + hold) return 1;
    if (t < tin + hold + out) return 1 - smooth((t - tin - hold) / out);
    return 0;
  }
  private bend(ctx: EffectCtx, p: Part, k: number, tiltScale: number) {
    const span = Math.max(this.y1 - this.y0, 1e-3);
    const u = Math.min(1, Math.max(0, (p.center.y - this.y0) / span));
    const A = (this.fx.amplitude ?? 0.016) * k;
    // Doble curva: lumbar hacia la izquierda (+X), torácica hacia la derecha (−X).
    const x = A * Math.sin(TAU * u);
    const slope = (A * TAU * Math.cos(TAU * u)) / span;
    const tilt = -Math.atan(slope) * tiltScale;
    const axial = (((this.fx.rotation ?? 6) * Math.PI) / 180) * k * Math.sin(TAU * u);
    _q.setFromAxisAngle(Y, axial);
    _qz.setFromAxisAngle(Z, tilt);
    _q.premultiply(_qz);
    _a.makeRotationFromQuaternion(_q);
    // T(c + x) · R · T(−c)
    _m.makeTranslation(p.center.x + x, p.center.y, p.center.z).multiply(_a);
    _b.makeTranslation(-p.center.x, -p.center.y, -p.center.z);
    ctx.deform(p, _m.multiply(_b));
  }
  apply(ctx: EffectCtx) {
    const k = this.phase(ctx) * this.env;
    for (const p of this.parts) this.bend(ctx, p, k, 1);
    for (const p of this.attach) this.bend(ctx, p, k, 0.5);
    return !ctx.reduced;
  }
}

class NerveFlowFx extends EffectInstance {
  readonly parts: Part[];
  /** Tubo principal (sin flow_offset): las ramas se sincronizan con él. */
  private main: Part | null;
  constructor(
    private fx: Extract<Effect, { type: "nerveFlow" }>,
    ctx: EffectCtx,
    lead: number,
  ) {
    super(fx, ctx, lead);
    this.parts = ctx.resolve(fx.mesh).filter((p) => p.kind === "tube");
    this.main = this.parts.find((p) => p.flowOffset === 0) ?? null;
  }
  apply(ctx: EffectCtx) {
    const fx = this.fx;
    const str = (fx.strength ?? 1) * this.env;
    const t = this.phaseTime(ctx);
    const breathe = fx.mode === "breathe";
    for (const p of this.parts) {
      const u = p.u;
      u.uVisible.value = Math.max(u.uVisible.value, this.env);
      if (ctx.reduced) {
        // Sin movimiento: el nervio queda encendido de forma estática.
        u.uBreathe.value = Math.max(u.uBreathe.value, 0.4 * str);
      } else if (breathe) {
        u.uBreathe.value = Math.max(u.uBreathe.value, 0.75 * str * osc(t, fx.period ?? 2.2));
      } else {
        const ph = (t / (fx.period ?? 2.2)) % 1;
        // El frente entra y sale completo del tubo (−0.2 → 1.2).
        let head = fx.reverse ? 1.2 - 1.4 * ph : -0.2 + 1.4 * ph;
        let width = fx.width ?? 0.12;
        const main = this.main;
        if (p.flowOffset > 0 && main && main !== p && p.length > 0) {
          // Rama (p. ej. peroneo desde el ciático): el pulso entra a la rama
          // cuando el del tronco llega al punto de ramificación, a la misma
          // velocidad en metros.
          const ratio = main.length / p.length;
          head = (head - p.flowOffset) * ratio;
          width *= ratio;
        }
        u.uHead.value = head;
        u.uDir.value = fx.reverse ? -1 : 1;
        u.uWidth.value = width;
        u.uFlow.value = Math.max(u.uFlow.value, str);
      }
    }
    return !ctx.reduced;
  }
}

class CanalPinchFx extends EffectInstance {
  readonly parts: Part[];
  constructor(
    private fx: Extract<Effect, { type: "canalPinch" }>,
    ctx: EffectCtx,
    lead: number,
  ) {
    super(fx, ctx, lead);
    this.parts = ctx.resolve(fx.mesh).filter((p) => p.kind === "tube");
  }
  apply(ctx: EffectCtx) {
    const k = ctx.reduced ? 1 : osc(this.phaseTime(ctx), this.fx.period ?? 3.3);
    const amt = (this.fx.amount ?? 0.0025) * k * this.env;
    const [r0, r1] = this.fx.range ?? [0.25, 0.75];
    for (const p of this.parts) {
      const u = p.u;
      u.uVisible.value = Math.max(u.uVisible.value, this.env);
      // uPinch va en unidades locales de la malla (puede venir en mm).
      u.uPinch.value = Math.max(u.uPinch.value, amt / p.worldScale);
      u.uRange.value.set(r0, r1);
      u.uBreathe.value = Math.max(u.uBreathe.value, 0.3 * k * this.env);
    }
    return !ctx.reduced;
  }
}

class SequenceFx extends EffectInstance {
  readonly parts: Part[] = [];
  private steps: { part: Part; strength: number }[][];
  constructor(
    private fx: Extract<Effect, { type: "sequence" }>,
    ctx: EffectCtx,
    lead: number,
  ) {
    super(fx, ctx, lead);
    this.steps = fx.steps.map((step: readonly TintSpec[]) =>
      step.flatMap((t) => ctx.resolve(t.mesh).map((part) => ({ part, strength: t.strength }))),
    );
  }
  apply(ctx: EffectCtx) {
    // Al salir no aporta tinte: el motor lo devuelve a reposo con su propia curva.
    if (this.target === 0 || !this.steps.length) return false;
    if (ctx.reduced) {
      for (const step of this.steps) for (const s of step) ctx.tint(s.part, s.strength);
      return false;
    }
    const dur = this.fx.stepDuration ?? 1.1;
    const idx = Math.floor(this.phaseTime(ctx) / dur) % this.steps.length;
    for (const s of this.steps[idx]) ctx.tint(s.part, s.strength);
    return true;
  }
}

/** `lead`: segundos que el gesto espera a la cámara (0 = de inmediato). */
export function createEffect(fx: Effect, ctx: EffectCtx, lead = 0): EffectInstance {
  switch (fx.type) {
    case "bulge":
      return new BulgeFx(fx, ctx, lead);
    case "slide":
      return new SlideFx(fx, ctx, lead);
    case "compress":
      return new CompressFx(fx, ctx, lead);
    case "scoliosis":
      return new ScoliosisFx(fx, ctx, lead);
    case "nerveFlow":
      return new NerveFlowFx(fx, ctx, lead);
    case "canalPinch":
      return new CanalPinchFx(fx, ctx, lead);
    case "sequence":
      return new SequenceFx(fx, ctx, lead);
  }
}
