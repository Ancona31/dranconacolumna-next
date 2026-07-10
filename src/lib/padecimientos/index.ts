import type { ConditionSlug } from "@/lib/conditions";
import type { Padecimiento } from "./types";
import { canalLumbarEstrecho } from "./canal-lumbar-estrecho";
import { ciatica } from "./ciatica";
import { herniaDeDisco } from "./hernia-de-disco";
import { vertebraDesplazada } from "./vertebra-desplazada";

/**
 * Registro central de padecimientos con contenido. Un slug presente aquí se
 * renderiza con la plantilla completa en /padecimientos/[slug]; un slug ausente
 * cae al placeholder. Agregar un padecimiento es solo añadir su archivo de datos
 * a este mapa.
 */
export const PADECIMIENTOS: Partial<Record<ConditionSlug, Padecimiento>> = {
  "hernia-de-disco": herniaDeDisco,
  ciatica: ciatica,
  "canal-lumbar-estrecho": canalLumbarEstrecho,
  "vertebra-desplazada": vertebraDesplazada,
};

export function getPadecimiento(slug: string): Padecimiento | undefined {
  return PADECIMIENTOS[slug as ConditionSlug];
}

/** Slugs que ya tienen contenido completo. Lo usa el índice para marcarlos. */
export const PADECIMIENTOS_CON_CONTENIDO = new Set(Object.keys(PADECIMIENTOS));

export type { Padecimiento } from "./types";
