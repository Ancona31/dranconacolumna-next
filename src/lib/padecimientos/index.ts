import type { ConditionSlug } from "@/lib/conditions";
import type { Padecimiento } from "./types";
import { canalLumbarEstrecho } from "./canal-lumbar-estrecho";
import { ciatica } from "./ciatica";
import { desviacionDeColumna } from "./desviacion-de-columna";
import { dolorDeCadera } from "./dolor-de-cadera";
import { dolorDeCodo } from "./dolor-de-codo";
import { dolorDeCuello } from "./dolor-de-cuello";
import { dolorDeHombro } from "./dolor-de-hombro";
import { dolorDeRodilla } from "./dolor-de-rodilla";
import { fracturaDeColumna } from "./fractura-de-columna";
import { fracturasYEsguinces } from "./fracturas-y-esguinces";
import { herniaDeDisco } from "./hernia-de-disco";
import { lesionesDeportivas } from "./lesiones-deportivas";
import { dolorDeMunecaYMano } from "./dolor-de-muneca-y-mano";
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
  "desviacion-de-columna": desviacionDeColumna,
  "fractura-de-columna": fracturaDeColumna,
  "dolor-de-cuello": dolorDeCuello,
  "dolor-de-hombro": dolorDeHombro,
  "dolor-de-codo": dolorDeCodo,
  "dolor-de-rodilla": dolorDeRodilla,
  "dolor-de-cadera": dolorDeCadera,
  "dolor-de-muneca-y-mano": dolorDeMunecaYMano,
  "fracturas-y-esguinces": fracturasYEsguinces,
  "lesiones-deportivas": lesionesDeportivas,
};

export function getPadecimiento(slug: string): Padecimiento | undefined {
  return PADECIMIENTOS[slug as ConditionSlug];
}

/** Slugs que ya tienen contenido completo. Lo usa el índice para marcarlos. */
export const PADECIMIENTOS_CON_CONTENIDO = new Set(Object.keys(PADECIMIENTOS));

export type { Padecimiento } from "./types";
