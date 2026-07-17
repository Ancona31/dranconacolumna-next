import { BODY_ZONES, type BodyZoneId } from "@/components/home/BodyFigureSVG";
import type { Locale } from "@/lib/i18n/types";

/**
 * Etiquetas de zona en inglés para la silueta corporal.
 *
 * BODY_ZONES guarda las etiquetas internas en español (las consume el home ES y
 * cualquier contexto ES). Este mapa las traduce por id SIN tocar esa fuente; el
 * resolutor cae de vuelta a la etiqueta interna cuando el locale es ES.
 */
const ZONE_LABELS_EN: Record<BodyZoneId, string> = {
  cuello: "Neck",
  "espalda-alta": "Upper back",
  "espalda-baja": "Lower back",
  hombro: "Shoulder",
  codo: "Elbow",
  muneca: "Wrist and hand",
  cadera: "Hip",
  rodilla: "Knee",
  tobillo: "Ankle and foot",
};

/** Etiqueta de una zona por locale; ES usa la etiqueta interna de BODY_ZONES. */
export function getZoneLabel(id: BodyZoneId, locale: Locale): string {
  if (locale === "en") return ZONE_LABELS_EN[id];
  return BODY_ZONES.find((z) => z.id === id)?.label ?? id;
}
