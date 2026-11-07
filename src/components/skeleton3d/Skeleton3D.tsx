"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefetchSkeletonAssets } from "./assets";
import { resolveQuality, webglApiAvailable } from "./quality";
import type { Skeleton3DProps } from "./types";
import type { SkeletonEngine } from "./engine";

/**
 * Esqueleto 3D en rayos X (plan §3.2). Decorativo: el canvas va con
 * aria-hidden y no toma foco; la navegación sigue en la lista de enlaces.
 *
 * Carga diferida: three.js, el .glb y el decodificador Draco se descargan en
 * paralelo solo cuando el componente se acerca al viewport (≈ 400 px antes).
 * Mientras tanto se ve la imagen fija del escenario activo (o `posterSrc` en
 * reposo); al estar listo el 3D, la imagen sale y luego entra el lienzo (sin
 * doble esqueleto). Sin WebGL, con error de carga, con quality="static" o si
 * se pierde el contexto WebGL se queda la imagen fija.
 *
 * El componente ocupa el 100 % de su contenedor: el tamaño y el fondo
 * ("escenario" azul tinta, D1-A) los pone quien lo usa.
 */

type Status = "idle" | "loading" | "ready" | "static";

/** Modelos definitivos (LOD): PC ~215 mil triángulos, celular ~89 mil. */
const DEFAULT_MODEL = { high: "/models/skeleton-high.glb", low: "/models/skeleton-low.glb" } as const;

/** --ease-out de la marca. */
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
// Relevo imagen → 3D (y entre imágenes): la saliente se va en 180 ms y la
// entrante aparece en 320 ms con 140 ms de retraso; se cruzan a < 10 %.
const OUT_MS = 180;
const IN_MS = 320;
const IN_DELAY_MS = 140;

export default function Skeleton3D({
  scenario,
  quality = "auto",
  interactive = false,
  posterSrc,
  modelSrc = DEFAULT_MODEL,
  extraTubes,
  idleTour = null,
  paused = false,
  posterPriority = "low",
}: Skeleton3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SkeletonEngine | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  // Las props que cambian se leen desde refs para no reiniciar la carga.
  const scenarioRef = useRef(scenario);
  const interactiveRef = useRef(interactive);
  const tubesRef = useRef(extraTubes);
  const tourRef = useRef(idleTour);
  const pausedRef = useRef(paused);
  useEffect(() => {
    scenarioRef.current = scenario;
    engineRef.current?.setScenario(scenario);
  }, [scenario]);
  useEffect(() => {
    interactiveRef.current = interactive;
    engineRef.current?.setInteractive(interactive);
  }, [interactive]);
  useEffect(() => {
    tubesRef.current = extraTubes;
  }, [extraTubes]);
  useEffect(() => {
    if (tourRef.current === idleTour) return;
    tourRef.current = idleTour;
    engineRef.current?.setIdleTour(idleTour);
  }, [idleTour]);
  useEffect(() => {
    pausedRef.current = paused;
    engineRef.current?.setPaused(paused);
  }, [paused]);

  const highSrc = typeof modelSrc === "string" ? modelSrc : modelSrc.high;
  const lowSrc = typeof modelSrc === "string" ? modelSrc : modelSrc.low;

  useEffect(() => {
    const host = hostRef.current;
    const stage = stageRef.current;
    if (!host || !stage) return;
    let cancelled = false;
    let started = false;

    const start = async () => {
      started = true;
      const q = resolveQuality(quality);
      // Sin la API de WebGL no se descarga nada. Si existe pero no se puede
      // crear el contexto, lo detecta el motor al crear el renderer.
      if (q === "static" || !webglApiAvailable()) {
        setStatus("static");
        return;
      }
      setStatus("loading");
      const src = q === "high" ? highSrc : lowSrc;
      // El .glb y Draco empiezan a bajar ya, en paralelo con el chunk de three.
      const assets = prefetchSkeletonAssets(src);
      try {
        // Chunk aparte: three.js no entra al bundle inicial.
        const { createSkeletonEngine } = await import("./engine");
        if (cancelled) return;
        const engine = await createSkeletonEngine({
          container: stage,
          modelSrc: src,
          model: assets.model,
          decoder: assets.decoder,
          quality: q,
          interactive: interactiveRef.current,
          extraTubes: tubesRef.current,
          idleTour: tourRef.current,
          paused: pausedRef.current,
          onContextLost: () => {
            if (!cancelled) setStatus("static");
          },
          onContextRestored: () => {
            if (!cancelled) setStatus("ready");
          },
        });
        if (cancelled) {
          engine.dispose();
          return;
        }
        engineRef.current = engine;
        // Props que pudieron cambiar mientras se descargaba el modelo.
        engine.setInteractive(interactiveRef.current);
        engine.setPaused(pausedRef.current);
        engine.setScenario(scenarioRef.current);
        setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          console.warn("[Skeleton3D] respaldo a imagen fija:", err);
          setStatus("static");
        }
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!started && entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void start();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [quality, highSrc, lowSrc]);

  const ready = status === "ready";
  // Mientras el 3D no está (carga, modo fijo, contexto perdido) se ve la
  // imagen del escenario activo. Con el 3D listo la imagen queda oculta y
  // congelada: un hover no descarga imágenes que nadie ve.
  const wanted = scenario?.poster ?? posterSrc;
  const [poster, setPoster] = useState(wanted);
  if (!ready && poster !== wanted) setPoster(wanted);

  return (
    <div ref={hostRef} className="relative h-full w-full" aria-hidden="true">
      {poster && <PosterLayer src={poster} fallback={posterSrc} visible={!ready} priority={posterPriority} />}
      <div
        ref={stageRef}
        className="rm-fade absolute inset-0 transition-opacity ease-out"
        style={{
          opacity: ready ? 1 : 0,
          transitionDuration: `${ready ? IN_MS : OUT_MS}ms`,
          transitionDelay: `${ready ? IN_DELAY_MS : 0}ms`,
        }}
      />
    </div>
  );
}

/**
 * Bordes desvanecidos: varias imágenes traen hueso o piel hasta el borde y,
 * como el escenario cambia de proporción, sin esto se ve el rectángulo. Es
 * lineal en los 4 lados (no radial) para no apagar el cráneo ni los pies.
 */
const EDGE_MASK =
  "linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent), linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)";
const POSTER_STYLE: CSSProperties = {
  maskImage: EDGE_MASK,
  WebkitMaskImage: EDGE_MASK,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};
// <img> nativo (como el hero): next/image recodificaría los AVIF hechos a mano.
// La caja de la imagen es la del dibujo (no `object-contain`), así la máscara
// cae en los bordes reales de la imagen con cualquier proporción del escenario.
const POSTER_CLASS = "pointer-events-none absolute inset-0 m-auto h-auto max-h-full w-auto max-w-full select-none";

/**
 * Imagen fija con relevo al cambiar de `src` (la saliente se retira; nunca
 * quedan dos imágenes encimadas) y que se oculta cuando el 3D está listo.
 * Si una imagen no existe (404), su capa se quita —nunca queda puesta la
 * zona de otro padecimiento— y se usa `fallback` (reposo); si tampoco
 * existe, queda el fondo de quien lo usa.
 */
function PosterLayer({
  src,
  fallback,
  visible,
  priority,
}: {
  src: string;
  fallback?: string;
  visible: boolean;
  priority: "high" | "low";
}) {
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const effective = !failed.has(src) ? src : fallback && !failed.has(fallback) ? fallback : null;

  // Patrón "estado derivado de props": la capa anterior se conserva solo si
  // ya se estaba viendo, mientras la nueva carga.
  const [layers, setLayers] = useState<{ cur: string | null; prev: string | null }>({ cur: effective, prev: null });
  if (layers.cur !== effective) {
    let prev: string | null = null;
    if (effective !== null && layers.cur !== null && !failed.has(layers.cur)) {
      prev = loaded.has(layers.cur) ? layers.cur : layers.prev;
    }
    setLayers({ cur: effective, prev });
  }

  const curRef = useRef<HTMLImageElement>(null);
  const prevRef = useRef<HTMLImageElement>(null);
  const markFailed = (s: string) => setFailed((f) => (f.has(s) ? f : new Set(f).add(s)));
  const markLoaded = (s: string) => setLoaded((f) => (f.has(s) ? f : new Set(f).add(s)));
  const dropPrev = (s: string) => setLayers((l) => (l.cur === s && l.prev ? { cur: s, prev: null } : l));

  const onCurLoad = (img: HTMLImageElement, s: string) => {
    markLoaded(s);
    const prevImg = prevRef.current;
    if (!prevImg || matchMedia("(prefers-reduced-motion: reduce)").matches || typeof img.animate !== "function") {
      dropPrev(s);
      return;
    }
    img.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: IN_MS,
      delay: IN_DELAY_MS,
      easing: EASE_OUT,
      fill: "backwards",
    });
    prevImg
      .animate([{ opacity: 1 }, { opacity: 0 }], { duration: OUT_MS, easing: EASE_OUT, fill: "forwards" })
      .finished.then(
        () => dropPrev(s),
        () => {},
      );
  };

  // Una imagen que cargó (o falló) antes de hidratar no dispara onLoad/onError.
  useEffect(() => {
    const img = curRef.current;
    const s = layers.cur;
    if (!img || !s || !img.complete) return;
    if (img.naturalWidth > 0) markLoaded(s);
    else markFailed(s);
  }, [layers.cur]);

  const high = priority === "high";
  return (
    <div
      className="rm-fade absolute inset-0 transition-opacity ease-out"
      style={{ opacity: visible ? 1 : 0, transitionDuration: `${OUT_MS}ms` }}
    >
      {layers.prev && (
        // eslint-disable-next-line @next/next/no-img-element -- AVIF ya optimizado a mano (ver arriba)
        <img
          // Claves por capa: React no debe mover el mismo <img> de una capa a
          // la otra (llegaría ya cargado, sin onLoad y con su fundido viejo).
          key={`prev:${layers.prev}`}
          ref={prevRef}
          src={layers.prev}
          alt=""
          width={720}
          height={900}
          decoding="async"
          draggable={false}
          className={POSTER_CLASS}
          style={POSTER_STYLE}
        />
      )}
      {layers.cur && (
        // eslint-disable-next-line @next/next/no-img-element -- AVIF ya optimizado a mano (ver arriba)
        <img
          key={`cur:${layers.cur}`}
          ref={curRef}
          src={layers.cur}
          alt=""
          width={720}
          height={900}
          // En /padecimientos esta imagen es el LCP: carga inmediata y prioridad alta.
          loading={high ? "eager" : "lazy"}
          fetchPriority={high ? "high" : undefined}
          decoding="async"
          draggable={false}
          className={POSTER_CLASS}
          style={POSTER_STYLE}
          onLoad={(e) => onCurLoad(e.currentTarget, layers.cur as string)}
          onError={() => markFailed(layers.cur as string)}
        />
      )}
    </div>
  );
}
