"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { preload } from "react-dom";
import type { Locale } from "@/lib/i18n/types";

/**
 * Arte del hero: diapositivas de rayos X (6 tomas renderizadas en Blender, azul
 * de marca sobre fondo transparente) que se funden entre sí con un zoom lento
 * (Ken Burns). Sin marco: los bordes se desvanecen hacia el fondo del hero con
 * una máscara radial.
 *
 * - La toma 1 se pinta visible desde el HTML del servidor (el hero queda
 *   completo antes de hidratar) y es la candidata a LCP: se precarga.
 * - Las tomas 2–6 se montan hasta que la página cargó y el navegador está
 *   ocioso, para no competir con la imagen principal. Con ahorro de datos
 *   (saveData) o red 2G no se piden: queda la toma 1 fija y sin botón.
 * - Antes de cada cambio se espera a `decode()` de la toma siguiente (sin
 *   tirones en equipos lentos); si una toma falla, se salta.
 * - Se pausa con la pestaña oculta y fuera de pantalla. Como cambia sola más
 *   de 5 s, lleva botón de pausa (WCAG 2.2.2), siempre visible en táctil. Con
 *   "reducir movimiento" queda la toma 1 fija y sin botón.
 * - Capas de GPU: `will-change` solo durante el fundido (entrada y salida);
 *   el resto del tiempo solo la toma activa tiene capa (por su Ken Burns).
 */

const BASE = "/img/skeleton/hero-slides";
const srcSetFor = (name: string, ext: "avif" | "webp" = "avif") =>
  `${BASE}/${name}-700.${ext} 700w, ${BASE}/${name}-1000.${ext} 1000w`;

// Mismo ancho que la caja: 82 % del contenedor (máx. 382 px) en celular y
// media columna (máx. 491 px) desde md.
const SIZES = "(min-width: 768px) min(491px, 50vw), min(382px, 82vw)";

// Cada toma: [escala, x %, y %] al inicio y al final de su zoom lento. Todas
// ACERCAN (1.0 → 1.06) con paneo propio: si una se alejara mientras la otra
// se acerca, en el fundido se vería un "nado".
type Pose = readonly [scale: number, x: number, y: number];
const SHOTS: readonly { name: string; from: Pose; to: Pose }[] = [
  { name: "1_columna_torax", from: [1.0, 0, 1], to: [1.06, 0, -2] },
  { name: "2_cervical", from: [1.0, 2, 0], to: [1.06, 0, 0] },
  { name: "3_hombro", from: [1.0, 0, 0], to: [1.06, -2, 1] },
  { name: "4_lumbar_pelvis", from: [1.0, 0, -2], to: [1.06, 0, 1] },
  { name: "5_mano_muneca", from: [1.0, -1, 0], to: [1.06, 1, -1] },
  { name: "6_rodilla", from: [1.0, 0, 2], to: [1.06, 0, 0] },
];
const HOLD = 7000; // tiempo que cada toma es la protagonista (decisión D2)
const FADE = 1200; // disolvencia; misma duración que duration-[1200ms]
const KEN_BURNS = HOLD + FADE; // el zoom dura también el fundido de salida
const RETRY = 400; // si la siguiente toma aún no está montada, se reintenta

const tf = ([s, x, y]: Pose) => `translate(${x}%, ${y}%) scale(${s})`;

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduce(onChange: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReduce = () => window.matchMedia(REDUCE_QUERY).matches;
const getFalse = () => false;

// Ahorro de datos / red muy lenta (Network Information API; solo Chromium).
// Donde no existe, se asume conexión normal.
type NetInfo = EventTarget & { saveData?: boolean; effectiveType?: string };
const conn = () =>
  (navigator as Navigator & { connection?: NetInfo }).connection;
function subscribeLite(onChange: () => void) {
  const c = conn();
  c?.addEventListener("change", onChange);
  return () => c?.removeEventListener("change", onChange);
}
const getLite = () => {
  const c = conn();
  return !!c?.saveData || c?.effectiveType === "slow-2g" || c?.effectiveType === "2g";
};

const LABELS = {
  es: { pause: "Pausar animación", play: "Reproducir animación" },
  en: { pause: "Pause animation", play: "Play animation" },
} as const;

export default function HeroSkeletonArt({
  href,
  ariaLabel,
  locale,
}: {
  href: string;
  ariaLabel: string;
  locale: Locale;
}) {
  // Precarga de la toma 1: React la sube al <head> durante el SSR.
  preload(`${BASE}/${SHOTS[0].name}-700.avif`, {
    as: "image",
    type: "image/avif",
    imageSrcSet: srcSetFor(SHOTS[0].name),
    imageSizes: SIZES,
    fetchPriority: "high",
  });

  const reduce = useSyncExternalStore(subscribeReduce, getReduce, getFalse);
  const lite = useSyncExternalStore(subscribeLite, getLite, getFalse);
  // Toma 1 fija: sin zoom, sin cambios y sin botón.
  const still = reduce || lite;

  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const anims = useRef<(Animation | undefined)[]>([]);
  // Tiempo que le queda a la toma activa (al reanudar no se reinicia el HOLD).
  const hold = useRef({ idx: 0, left: HOLD });

  // `prev`: toma que sale durante el fundido (−1 fuera de él).
  const [{ active, prev }, setShot] = useState({ active: 0, prev: -1 });
  const [restReady, setRestReady] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const running = !still && !userPaused && inView && pageVisible;
  // Con toma fija se vuelve (con fundido) a la toma 1.
  const shown = still ? 0 : active;

  // Tomas 2–6: hasta después del evento load y en un momento ocioso.
  useEffect(() => {
    if (still || restReady) return;
    let idleId: number | undefined;
    let timerId: number | undefined;
    const mount = () => setRestReady(true);
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(mount, { timeout: 2000 });
      } else {
        timerId = window.setTimeout(mount, 800);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [still, restReady]);

  // Pestaña oculta o hero fuera de pantalla → pausa.
  useEffect(() => {
    if (still) return;
    const wrap = wrapRef.current;
    let io: IntersectionObserver | undefined;
    if (wrap && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) =>
        setInView(entry.isIntersecting),
      );
      io.observe(wrap);
    }
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [still]);

  // Ken Burns de la toma que entra. La que sale conserva su animación (dura
  // también el fundido), así no "salta" mientras se desvanece.
  useEffect(() => {
    if (still) return;
    const img = imgRefs.current[active];
    if (!img || typeof img.animate !== "function") return;
    anims.current[active]?.cancel();
    anims.current[active] = img.animate(
      [
        { transform: tf(SHOTS[active].from) },
        { transform: tf(SHOTS[active].to) },
      ],
      { duration: KEN_BURNS, easing: "linear", fill: "forwards" },
    );
  }, [active, still]);

  // Fin del fundido: la toma que salió ya es invisible; se cancela su zoom
  // (y con él su capa de GPU) y se quita el will-change de ambas.
  useEffect(() => {
    if (prev < 0) return;
    const id = window.setTimeout(() => {
      anims.current[prev]?.cancel();
      anims.current[prev] = undefined;
      setShot((s) => ({ ...s, prev: -1 }));
    }, FADE + 100);
    return () => window.clearTimeout(id);
  }, [prev]);

  // Avance de tomas + pausa/reanudación de los zooms en curso.
  useEffect(() => {
    if (still) {
      anims.current.forEach((a) => a?.cancel());
      return;
    }
    if (!running) {
      anims.current.forEach((a) => a?.pause());
      return;
    }
    anims.current.forEach((a) => {
      if (a && a.playState === "paused") a.play();
    });
    if (hold.current.idx !== active) hold.current = { idx: active, left: HOLD };

    let cancelled = false;
    let timerId: number | undefined;
    let fails = 0;
    const startedAt = performance.now();

    const tryShot = (nextIdx: number) => {
      const next = imgRefs.current[nextIdx];
      // Aún no se montan las tomas 2–6: se espera en vez de mostrar un hueco.
      if (!next) {
        timerId = window.setTimeout(() => tryShot(nextIdx), RETRY);
        return;
      }
      // decode() espera a que la imagen cargue y esté decodificada; si falla
      // (404, formato roto) se salta a la siguiente.
      const ready =
        typeof next.decode === "function"
          ? next.decode()
          : next.complete && next.naturalWidth > 0
            ? Promise.resolve()
            : Promise.reject(new Error("toma no lista"));
      ready.then(
        () => {
          if (!cancelled) setShot({ active: nextIdx, prev: active });
        },
        () => {
          if (cancelled) return;
          fails += 1;
          const after = (nextIdx + 1) % SHOTS.length;
          // Si ya no queda ninguna otra toma válida, se queda en la actual.
          if (fails < SHOTS.length - 1 && after !== active) tryShot(after);
        },
      );
    };

    timerId = window.setTimeout(
      () => tryShot((active + 1) % SHOTS.length),
      hold.current.left,
    );
    return () => {
      cancelled = true;
      if (timerId !== undefined) window.clearTimeout(timerId);
      const elapsed = performance.now() - startedAt;
      hold.current.left = Math.max(0, hold.current.left - elapsed);
    };
  }, [running, active, still]);

  // Al desmontar, se cancelan los zooms.
  useEffect(() => {
    const list = anims.current;
    return () => list.forEach((a) => a?.cancel());
  }, []);

  const t = LABELS[locale === "en" ? "en" : "es"];
  const fading = !still && prev >= 0;

  return (
    <div
      ref={wrapRef}
      className="group relative w-[82%] max-w-[382px] md:w-full md:max-w-[491px]"
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className="relative block aspect-[4/5] rounded-3xl"
      >
        {/* Arte decorativo: el nombre accesible lo da el <Link>. La máscara
            desvanece los bordes hacia el fondo del hero (sin marco). */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden [-webkit-mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,rgba(0,0,0,.5)_78%,transparent_100%)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,rgba(0,0,0,.5)_78%,transparent_100%)]"
        >
          {SHOTS.map((shot, i) => {
            if (i > 0 && (still || !restReady)) return null;
            const first = i === 0;
            return (
              // <picture> nativo: AVIF ya optimizados a mano (el optimizador de
              // Next los re-codificaría), con WebP para navegadores sin AVIF
              // (p. ej. iOS 15). Ancho/alto fijos: sin CLS.
              <picture key={shot.name}>
                <source
                  type="image/avif"
                  srcSet={srcSetFor(shot.name)}
                  sizes={SIZES}
                />
                <source
                  type="image/webp"
                  srcSet={srcSetFor(shot.name, "webp")}
                  sizes={SIZES}
                />
                <img
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  src={`${BASE}/${shot.name}-700.webp`}
                  alt=""
                  width={700}
                  height={875}
                  fetchPriority={first ? "high" : "low"}
                  loading={first ? "eager" : "lazy"}
                  decoding={first ? undefined : "async"}
                  style={{
                    // La toma 1 arranca ya en su encuadre inicial para que el
                    // zoom no dé un salto al hidratar.
                    transform: first ? tf(shot.from) : undefined,
                    // Capa de GPU solo mientras dura el fundido.
                    willChange:
                      fading && (i === shown || i === prev)
                        ? "opacity, transform"
                        : undefined,
                  }}
                  // Disolvencia con curva de seno (pareja de principio a fin):
                  // es un elemento ambiental, no un corte.
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.37,0,0.63,1)] ${
                    i === shown ? "opacity-100" : "opacity-0"
                  }`}
                />
              </picture>
            );
          })}
        </div>
      </Link>

      {/* Hermano del enlace (no dentro): un botón dentro de <a> no es válido.
          motion-reduce:hidden lo oculta ya desde el HTML del servidor.
          - 44 px (dedos con temblor); siempre visible con puntero táctil, donde
            no hay hover que lo descubra.
          - scroll-margin: al llegar con Tab en celular no queda bajo la barra
            de acciones fija (4.5rem + zona segura). */}
      {!still && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? t.play : t.pause}
          title={userPaused ? t.play : t.pause}
          className={`absolute bottom-[6%] right-[8%] z-10 inline-flex size-11 scroll-mb-[calc(5.5rem+env(safe-area-inset-bottom))] items-center justify-center rounded-full bg-primary-soft/95 text-primary ring-1 ring-primary/25 transition-opacity duration-150 ease-out hover:bg-primary-soft focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100 motion-reduce:hidden md:scroll-mb-4 ${
            userPaused ? "opacity-100" : "opacity-0"
          }`}
        >
          {userPaused ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-4 translate-x-px"
              fill="currentColor"
            >
              <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-4"
              fill="currentColor"
            >
              <rect x="3.5" y="2.5" width="3" height="11" rx="0.8" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="0.8" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
