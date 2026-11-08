import type { CSSProperties } from "react";

/**
 * Bordes desvanecidos: sobre el fondo claro no hay caja que contenga al
 * esqueleto, así que un hueso cortado a cuchillo en el borde dejaría ver el
 * rectángulo (encuadres cercanos, imágenes que traen hueso o piel hasta el
 * borde). Solo es alfa: funciona igual sobre cualquier fondo. Es lineal en
 * los 4 lados (no radial) para no apagar el cráneo ni los pies.
 *
 * Lo comparten el lienzo 3D y sus imágenes fijas (Skeleton3D) y el póster
 * del hero de cada padecimiento (HeroZoneFigure).
 */
const EDGE_MASK =
  "linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent), linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)";

export const EDGE_FADE_STYLE: CSSProperties = {
  maskImage: EDGE_MASK,
  WebkitMaskImage: EDGE_MASK,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};
