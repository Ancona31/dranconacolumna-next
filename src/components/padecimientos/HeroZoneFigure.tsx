"use client";

import {
  BODY_PATH,
  BODY_ZONES,
  type BodyZoneId,
} from "@/components/home/BodyFigureSVG";

type HeroZoneFigureProps = {
  testZone: BodyZoneId;
  /**
   * Pie de la silueta. Por defecto usa la etiqueta interna en español de
   * BODY_ZONES; las páginas EN pasan aquí la zona ya traducida.
   */
  caption?: string;
  /** aria-label de la silueta. Por defecto, el español interno. */
  ariaLabel?: string;
};

const ACCENT = "var(--color-accent, #1B6CA8)";
const INK = "var(--color-primary, #0B3C5D)";

/**
 * Silueta de marca del hero: reutiliza el BODY_PATH y las zonas de
 * BodyFigureSVG (mismo patrón de la mini-silueta del PDF) y marca la zona del
 * test en accent con halo. Es un componente cliente porque las constantes que
 * importa viven en un módulo "use client"; no tiene interacción propia.
 */
export default function HeroZoneFigure({
  testZone,
  caption,
  ariaLabel,
}: HeroZoneFigureProps) {
  const zona = BODY_ZONES.find((z) => z.id === testZone);
  if (!zona) return null;

  const figureAria =
    ariaLabel ?? `Silueta del cuerpo con la zona ${zona.label} marcada`;
  const figureCaption = caption ?? `Zona: ${zona.label}`;

  return (
    <div className="rounded-2xl bg-primary-soft p-6">
      <svg
        viewBox="0 0 220 540"
        className="mx-auto h-72 w-auto md:h-80"
        role="img"
        aria-label={figureAria}
      >
        <path d={BODY_PATH} fill={ACCENT} opacity="0.16" />
        <path
          d={BODY_PATH}
          fill="none"
          stroke={INK}
          strokeOpacity="0.42"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx={zona.cx} cy={zona.cy} r="20" fill={ACCENT} opacity="0.22" />
        <circle
          cx={zona.cx}
          cy={zona.cy}
          r="9"
          fill={ACCENT}
          stroke="var(--color-background, #FBFBF9)"
          strokeWidth="2.5"
        />
      </svg>
      <p className="mt-2 text-center font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary/70">
        {figureCaption}
      </p>
    </div>
  );
}
