"use client";

import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import ButtonLink from "@/components/ui/Button";
import { REVIEWS, type Review } from "@/lib/reviews";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";

const GOOGLE_REVIEWS_URL = "https://share.google/F6JriyuEKHSREzTfi";

/** Longitud a la que se trunca el texto antes de "Leer más". */
const TRUNCATE_AT = 200;

// Sin avance automático (decisión D4): leer una reseña toma 8–12 s y en
// táctil no había pausa visible. Solo flechas, puntos y deslizar.

/** Tras el último evento de scroll se da por terminado el desplazamiento y se
 *  olvida el destino pendiente de las flechas (respaldo de `scrollend`). */
const SCROLL_IDLE_MS = 150;

/** Duración del fundido con el que el bucle vuelve al inicio (en vez de
 *  rebobinar todas las tarjetas de golpe). */
const WRAP_FADE_MS = 200;

/** Logotipo "G" de Google en sus 4 colores oficiales (SVG inline). */
function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Google"
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function Stars({
  className = "h-4 w-4",
  label,
}: {
  className?: string;
  label: string;
}) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${className} text-star`}
          fill="currentColor"
          strokeWidth={0}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/** Tarjeta con expansión local de "Leer más". */
function ReviewCard({
  review,
  cardLabel,
  readMore,
  readLess,
  starsAria,
}: {
  review: Review;
  cardLabel: string;
  readMore: string;
  readLess: string;
  starsAria: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > TRUNCATE_AT;
  const shown =
    expanded || !isLong
      ? review.text
      : `${review.text.slice(0, TRUNCATE_AT).trimEnd()}…`;
  const initial = review.author.charAt(0).toUpperCase();

  // Sin escala en hover/press: agrandar al presionar contradice la respuesta
  // esperada y emborrona el texto. En md+ la tarjeta se eleva 2px, con la
  // misma curva y duración que las tarjetas de padecimientos (150 ms,
  // ease-out; ease-drawer es para paneles).
  return (
    <div className="flex h-full min-h-[340px] flex-col rounded-2xl border border-ink/10 bg-white p-7 shadow-card transition-[translate,box-shadow] duration-150 ease-out hover:shadow-raised md:min-h-[330px] md:hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-base font-bold text-white"
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-body text-[15px] font-semibold text-ink">
            {review.author}
          </p>
          <p className="font-body text-xs text-ink/[0.55]">{cardLabel}</p>
        </div>
        <GoogleG className="h-5 w-5 shrink-0 self-start" />
      </div>

      <div className="mt-4">
        <Stars className="h-4 w-4" label={starsAria} />
      </div>

      <p className="mt-3 font-body text-[14.5px] leading-[1.7] text-ink/[0.78]">
        {shown}
        {isLong && (
          // El padding negativo agranda el área de toque sin mover la línea.
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="-my-2 ml-1 py-2 font-body text-[13px] font-semibold text-accent hover:underline"
          >
            {expanded ? readLess : readMore}
          </button>
        )}
      </p>
    </div>
  );
}

/** Distancia entre el inicio de dos tarjetas consecutivas (ancho + gap). */
function stepOf(el: HTMLElement): number {
  const [first, second] = el.children as unknown as HTMLElement[];
  if (!first || !second) return el.clientWidth;
  return second.offsetLeft - first.offsetLeft;
}

export default function GoogleReviews({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).reviews;
  const [current, setCurrent] = useState(0);
  const [perView, setPerView] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [fading, setFading] = useState(false);

  const scrollerRef = useRef<HTMLUListElement>(null);
  const fadeTimerRef = useRef<number | undefined>(undefined);
  // Destino del último clic en flechas o puntos mientras el scroll suave
  // sigue en curso. `shown` sale del scrollLeft redondeado y, a media
  // animación, todavía apunta a la tarjeta de origen: sin esto un segundo
  // clic rápido iría a la misma tarjeta y se "perdería".
  const targetRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | undefined>(undefined);

  const positions = Math.max(1, REVIEWS.length - perView + 1);
  // Al pasar de móvil (más posiciones) a desktop el índice puede quedar fuera
  // de rango; se acota aquí en vez de en un efecto.
  const shown = Math.min(current, positions - 1);

  // Tarjetas por vista (1 / 2 en md / 3 en lg) y prefers-reduced-motion.
  useEffect(() => {
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setPerView(mqLg.matches ? 3 : mqMd.matches ? 2 : 1);
      setReduced(mqReduce.matches);
    };

    sync();
    mqMd.addEventListener("change", sync);
    mqLg.addEventListener("change", sync);
    mqReduce.addEventListener("change", sync);
    return () => {
      mqMd.removeEventListener("change", sync);
      mqLg.removeEventListener("change", sync);
      mqReduce.removeEventListener("change", sync);
    };
  }, []);

  // El índice sale de la posición real del scroll (deslizar con el dedo, el
  // trackpad o las flechas), así los puntos siempre reflejan lo que se ve.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let frame = 0;
    const settle = () => {
      targetRef.current = null;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step = stepOf(el);
        if (step > 0) setCurrent(Math.round(el.scrollLeft / step));
      });
      // Respaldo para navegadores sin `scrollend`.
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(settle, SCROLL_IDLE_MS);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", settle);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimerRef.current);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", settle);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(fadeTimerRef.current), []);

  /** Mueve `delta` posiciones desde el destino pendiente (si lo hay) o desde
   *  lo que se ve: cada clic suma aunque el scroll anterior no haya acabado. */
  const step = (delta: number) => goTo((targetRef.current ?? shown) + delta);

  const goTo = (target: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = stepOf(el);

    if (target >= 0 && target < positions) {
      if (target === shown && targetRef.current === null) return;
      targetRef.current = target;
      // Clic durante el fundido del bucle: el carrusel está invisible, así
      // que se salta directo al destino nuevo en vez de dejar que el salto
      // pendiente lo pise.
      if (fadeTimerRef.current !== undefined) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = undefined;
        el.scrollTo({ left: target * width, behavior: "auto" });
        setFading(false);
        return;
      }
      el.scrollTo({ left: target * width, behavior: reduced ? "auto" : "smooth" });
      return;
    }

    // Bucle: en vez de rebobinar todas las tarjetas, fundido corto y salto.
    const wrapped = target < 0 ? positions - 1 : 0;
    targetRef.current = wrapped;
    if (reduced) {
      el.scrollTo({ left: wrapped * width, behavior: "auto" });
      return;
    }
    setFading(true);
    window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => {
      fadeTimerRef.current = undefined;
      el.scrollTo({ left: wrapped * width, behavior: "auto" });
      setFading(false);
    }, WRAP_FADE_MS);
  };

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20">
        {/* Encabezado */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {c.eyebrow}
            </p>
            <h2 className="mt-2 font-heading text-4xl font-extrabold text-primary">
              {c.h2}
            </h2>
          </div>

          <div className="md:text-right">
            <div className="flex items-center gap-3 md:justify-end">
              <span className="font-heading text-[32px] font-bold leading-none text-primary tabular-nums">
                {c.ratingNumber}
              </span>
              <Stars className="h-5 w-5" label={c.starsAria} />
            </div>
            <p className="mt-2 font-body text-[13px] text-muted">
              {c.ratingCaption}
            </p>
          </div>
        </div>

        {/* Carrusel: scroll nativo con snap, así en móvil se desliza con el
            dedo con la inercia del sistema. py-3 deja aire para la sombra y la
            elevación en hover; el sangrado horizontal (-mx-3/px-3 con
            scroll-px-3) es solo md+: en móvil cada tarjeta llena el 100%. */}
        <div className="mt-12 md:mt-14">
          <ul
            ref={scrollerRef}
            className={`relative flex list-none snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-3 [scrollbar-width:none] md:-mx-3 md:scroll-px-3 md:gap-6 md:px-3 [&::-webkit-scrollbar]:hidden transition-opacity duration-200 ease-out ${
              fading ? "opacity-0" : ""
            }`}
          >
            {REVIEWS.map((review, i) => (
              <li
                key={review.author}
                // Las tarjetas fuera de vista no reciben foco ni lector de
                // pantalla; se llega a ellas con flechas, puntos o deslizando.
                inert={i < shown || i >= shown + perView}
                className="min-w-0 shrink-0 basis-full snap-start md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
              >
                <ReviewCard
                  review={review}
                  cardLabel={c.cardLabel}
                  readMore={c.readMore}
                  readLess={c.readLess}
                  starsAria={c.starsAria}
                />
              </li>
            ))}
          </ul>

          {/* Flechas (desktop) */}
          <div className="mt-8 hidden items-center justify-center gap-4 md:flex">
            <button
              type="button"
              aria-label={c.prevAria}
              onClick={() => step(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-primary text-primary transition-[background-color,color,scale] duration-150 ease-out hover:bg-primary hover:text-white active:scale-[0.97]"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={c.nextAria}
              onClick={() => step(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-primary text-primary transition-[background-color,color,scale] duration-150 ease-out hover:bg-primary hover:text-white active:scale-[0.97]"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          {/* Puntos (móvil): punto de 8px dentro de un área táctil de 44px. */}
          <div className="mt-4 flex items-center justify-center md:hidden">
            {Array.from({ length: positions }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${c.goToReview} ${i + 1}`}
                aria-current={i === shown ? "true" : undefined}
                onClick={() => goTo(i)}
                className="grid h-11 w-11 place-items-center"
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full transition-colors duration-150 ease-out ${
                    i === shown ? "bg-primary" : "bg-primary/25"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Cierre */}
        <div className="mt-12 text-center">
          <ButtonLink href={GOOGLE_REVIEWS_URL} external size="lg">
            {c.seeAll}
          </ButtonLink>
          <p className="mx-auto mt-8 max-w-2xl font-body text-xs leading-relaxed text-muted">
            {c.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
