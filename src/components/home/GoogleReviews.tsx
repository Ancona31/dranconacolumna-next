"use client";

import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS, type Review } from "@/lib/reviews";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";

const GOOGLE_REVIEWS_URL = "https://share.google/F6JriyuEKHSREzTfi";

/** Longitud a la que se trunca el texto antes de "Leer más". */
const TRUNCATE_AT = 200;

/** Colores oficiales de Google; el borde de cada tarjeta rota en este orden. */
const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

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
          className={`${className} text-[#E9B44C]`}
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
  borderColor,
  cardLabel,
  readMore,
  readLess,
  starsAria,
}: {
  review: Review;
  borderColor: string;
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

  return (
    <div
      style={{ borderColor }}
      className="flex h-full min-h-[340px] flex-col rounded-2xl border-2 bg-white p-7 shadow-[0_4px_16px_rgba(11,60,93,0.10)] transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-[0_10px_28px_rgba(11,60,93,0.16)] active:scale-[1.02] md:min-h-[330px]"
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-heading text-base font-bold text-white"
          style={{ backgroundColor: "#0B3C5D" }}
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
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="ml-1 font-body text-[13px] font-semibold text-accent hover:underline"
          >
            {expanded ? readLess : readMore}
          </button>
        )}
      </p>
    </div>
  );
}

export default function GoogleReviews({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).reviews;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);
  const [reduced, setReduced] = useState(false);
  // `tick` sirve solo para reiniciar el autoplay tras una navegación manual.
  const [tick, setTick] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const gap = visible === 1 ? 16 : 24;
  const positions = Math.max(1, REVIEWS.length - visible + 1);
  // Índice efectivo: al pasar de móvil (más posiciones) a desktop, el índice
  // guardado puede quedar fuera de rango; se acota aquí en vez de en un efecto.
  const current = Math.min(index, positions - 1);

  // Mide el ancho de tarjeta y decide cuántas caben, según el breakpoint md.
  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      const v = mqDesktop.matches ? 3 : 1;
      const g = v === 1 ? 16 : 24;
      setVisible(v);
      const el = viewportRef.current;
      if (el) setCardWidth((el.clientWidth - (v - 1) * g) / v);
    };
    const syncReduced = () => setReduced(mqReduce.matches);

    measure();
    syncReduced();
    window.addEventListener("resize", measure);
    mqReduce.addEventListener("change", syncReduced);
    return () => {
      window.removeEventListener("resize", measure);
      mqReduce.removeEventListener("change", syncReduced);
    };
  }, []);

  // Autoplay: avanza cada 4 s, en bucle. Se detiene con hover (pausedRef) y se
  // reinicia con cada navegación manual (tick). Nunca corre con reduced-motion.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % positions);
    }, 4000);
    return () => window.clearInterval(id);
  }, [positions, reduced, tick]);

  const go = (next: number) => {
    setIndex(((next % positions) + positions) % positions);
    setTick((t) => t + 1);
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
              <span className="font-heading text-[32px] font-bold leading-none text-primary">
                {c.ratingNumber}
              </span>
              <Stars className="h-5 w-5" label={c.starsAria} />
            </div>
            <p className="mt-2 font-body text-[13px] text-ink/60">
              {c.ratingCaption}
            </p>
          </div>
        </div>

        {/* Carrusel */}
        <div className="mt-12 md:mt-14">
          {/* py-3 siempre: deja aire vertical para la sombra y el scale(1.02).
              El sangrado horizontal (-mx-3/px-3) es solo md+: en móvil cada
              tarjeta debe llenar el 100% del viewport para quedar centrada, sin
              una ventana lateral por la que se asome la tarjeta vecina. */}
          <div
            className="overflow-hidden py-3 md:-mx-3 md:px-3"
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
          >
            <div ref={viewportRef}>
              <ul
                className="flex list-none"
                style={{
                  gap: `${gap}px`,
                  transform: `translateX(-${current * (cardWidth + gap)}px)`,
                  transition: reduced
                    ? "none"
                    : "transform 700ms cubic-bezier(0.25, 0.8, 0.35, 1)",
                }}
              >
                {REVIEWS.map((review, i) => (
                  <li
                    key={review.author}
                    className="min-w-0"
                    style={{
                      flex: `0 0 calc((100% - ${(visible - 1) * gap}px) / ${visible})`,
                    }}
                  >
                    <ReviewCard
                      review={review}
                      borderColor={GOOGLE_COLORS[i % GOOGLE_COLORS.length]}
                      cardLabel={c.cardLabel}
                      readMore={c.readMore}
                      readLess={c.readLess}
                      starsAria={c.starsAria}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Flechas (desktop) */}
          <div className="mt-8 hidden items-center justify-center gap-4 md:flex">
            <button
              type="button"
              aria-label={c.prevAria}
              onClick={() => go(current - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-primary text-primary transition-colors duration-150 hover:bg-primary hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={c.nextAria}
              onClick={() => go(current + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-primary text-primary transition-colors duration-150 hover:bg-primary hover:text-white"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          {/* Puntos (móvil) */}
          <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
            {Array.from({ length: positions }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${c.goToReview} ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                onClick={() => go(i)}
                className="h-2 w-2 rounded-full transition-colors duration-150"
                style={{
                  backgroundColor:
                    i === current ? "#0B3C5D" : "rgba(11, 60, 93, 0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Cierre */}
        <div className="mt-12 text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-[30px] py-[14px] font-body text-[15px] font-semibold text-white transition-opacity duration-150 hover:opacity-90"
            style={{ backgroundColor: "#0B3C5D" }}
          >
            {c.seeAll}
          </a>
        </div>
      </div>
    </section>
  );
}
