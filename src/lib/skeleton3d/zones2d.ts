import type { BodyZoneId } from "@/components/home/BodyFigureSVG";

/**
 * Imagen 2D del selector de zonas: radiografía en tinta (vista posterior,
 * esqueleto completo + piel tenue, fondo transparente, proporción 1:1.8).
 * Renderizada desde el mismo modelo del esqueleto 3D. Solo datos: no importa
 * three.js ni componentes cliente, así que sirve igual en servidor y cliente.
 */
export const ZONES_IMAGE = {
  /** Ruta base sin ancho ni extensión: `${base}-450.avif`, `${base}-800.webp`… */
  base: "/img/skeleton/zonas/zonas-posterior",
  widths: [450, 800] as const,
  /** Dimensiones intrínsecas (para reservar el alto y evitar CLS). */
  width: 800,
  height: 1440,
};

/** srcset de un formato con los anchos disponibles. */
export function zonesSrcSet(format: "avif" | "webp"): string {
  return ZONES_IMAGE.widths
    .map((w) => `${ZONES_IMAGE.base}-${w}.${format} ${w}w`)
    .join(", ");
}

/**
 * Centro de cada zona proyectado sobre la imagen, en % del ancho (left) y del
 * alto (top). Proyectados desde los puntos anatómicos del modelo 3D con la
 * misma cámara del render; NO ajustar a ojo: si cambia la imagen, se vuelven
 * a proyectar. Los ids coinciden con BODY_ZONES.
 */
export const ZONE_POSITIONS: Readonly<
  Record<BodyZoneId, readonly [left: number, top: number]>
> = {
  cuello: [50.05, 16.85],
  "espalda-alta": [50.41, 25.76],
  "espalda-baja": [50.08, 39.47],
  hombro: [34.26, 21.29],
  codo: [29.68, 35.71],
  muneca: [25.66, 48.25],
  cadera: [57.99, 48.33],
  rodilla: [57.19, 71.57],
  tobillo: [58.22, 93.25],
};
