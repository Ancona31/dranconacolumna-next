"use client";

import { BODY_ZONES, type BodyZoneId } from "@/components/home/BodyFigureSVG";
import { REST_POSTER } from "@/lib/skeleton3d/scenarios";
import { EDGE_FADE_STYLE } from "@/lib/skeleton3d/edgeFade";

type HeroZoneFigureProps = {
  testZone: BodyZoneId;
  /**
   * Imagen fija del padecimiento (la misma del escenario 3D de la home,
   * resuelta por su slug ES). Si no carga, se cambia a la de reposo.
   */
  posterSrc: string;
  /**
   * Pie de la figura. Por defecto usa la etiqueta interna en español de
   * BODY_ZONES; las páginas EN pasan aquí la zona ya traducida.
   */
  caption?: string;
};

/** Cambia a la imagen de reposo si la del padecimiento no existe (404). */
function fallBackToRest(img: HTMLImageElement) {
  if (!img.src.endsWith(REST_POSTER)) img.src = REST_POSTER;
}

/**
 * Figura del hero: la radiografía en tinta del padecimiento (misma imagen
 * que su escenario en la sección 3D), directo sobre el fondo del hero, sin
 * caja, con los bordes desvanecidos como el 3D. Decorativa: el pie nombra la
 * zona. Es cliente solo por el respaldo onError.
 */
export default function HeroZoneFigure({
  testZone,
  posterSrc,
  caption,
}: HeroZoneFigureProps) {
  const zona = BODY_ZONES.find((z) => z.id === testZone);
  if (!zona) return null;

  const figureCaption = caption ?? `Zona: ${zona.label}`;

  return (
    <div>
      {/* <img> nativo: next/image recodificaría los AVIF hechos a mano.
          width/height (4:5) reservan el alto antes de cargar: sin salto. En
          PC está en el primer viewport, así que carga ya y con prioridad. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        width={720}
        height={900}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="pointer-events-none mx-auto block h-[336px] w-auto max-w-full select-none object-contain md:h-[352px] lg:h-[400px]"
        style={EDGE_FADE_STYLE}
        // Una imagen que falló antes de hidratar no dispara onError: se
        // revisa al montar.
        ref={(img) => {
          if (img?.complete && img.naturalWidth === 0) fallBackToRest(img);
        }}
        onError={(e) => fallBackToRest(e.currentTarget)}
      />
      <p className="mt-2 text-center font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary/70">
        {figureCaption}
      </p>
    </div>
  );
}
