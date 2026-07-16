import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import type { Locale } from "@/lib/i18n/types";
import type { TestDefinition } from "@/lib/evaluacion/types";
import { assembleTest } from "./assemble";
import type { TestContent, TestStructure } from "./types";

import { caderaStructure } from "./definitions/cadera";
import { codoStructure } from "./definitions/codo";
import { cuelloStructure } from "./definitions/cuello";
import { espaldaAltaStructure } from "./definitions/espalda-alta";
import { espaldaBajaStructure } from "./definitions/espalda-baja";
import { hombroStructure } from "./definitions/hombro";
import { munecaStructure } from "./definitions/muneca";
import { rodillaStructure } from "./definitions/rodilla";
import { tobilloStructure } from "./definitions/tobillo";

import { caderaContentEs } from "./content/es/cadera";
import { codoContentEs } from "./content/es/codo";
import { cuelloContentEs } from "./content/es/cuello";
import { espaldaAltaContentEs } from "./content/es/espalda-alta";
import { espaldaBajaContentEs } from "./content/es/espalda-baja";
import { hombroContentEs } from "./content/es/hombro";
import { munecaContentEs } from "./content/es/muneca";
import { rodillaContentEs } from "./content/es/rodilla";
import { tobilloContentEs } from "./content/es/tobillo";

import { caderaContentEn } from "./content/en/cadera";
import { codoContentEn } from "./content/en/codo";
import { cuelloContentEn } from "./content/en/cuello";
import { espaldaAltaContentEn } from "./content/en/espalda-alta";
import { espaldaBajaContentEn } from "./content/en/espalda-baja";
import { hombroContentEn } from "./content/en/hombro";
import { munecaContentEn } from "./content/en/muneca";
import { rodillaContentEn } from "./content/en/rodilla";
import { tobilloContentEn } from "./content/en/tobillo";

type TestEntry = {
  structure: TestStructure;
  content: Record<Locale, TestContent>;
};

/**
 * Registro central por zona: estructura (lógica) + contenido por locale. Una
 * zona presente aquí queda activa en el mapa; una ausente queda inhabilitada.
 * Hoy están las nueve: el mapa está completo.
 */
const REGISTRY: Partial<Record<BodyZoneId, TestEntry>> = {
  cadera: {
    structure: caderaStructure,
    content: { es: caderaContentEs, en: caderaContentEn },
  },
  codo: {
    structure: codoStructure,
    content: { es: codoContentEs, en: codoContentEn },
  },
  cuello: {
    structure: cuelloStructure,
    content: { es: cuelloContentEs, en: cuelloContentEn },
  },
  "espalda-alta": {
    structure: espaldaAltaStructure,
    content: { es: espaldaAltaContentEs, en: espaldaAltaContentEn },
  },
  "espalda-baja": {
    structure: espaldaBajaStructure,
    content: { es: espaldaBajaContentEs, en: espaldaBajaContentEn },
  },
  hombro: {
    structure: hombroStructure,
    content: { es: hombroContentEs, en: hombroContentEn },
  },
  muneca: {
    structure: munecaStructure,
    content: { es: munecaContentEs, en: munecaContentEn },
  },
  rodilla: {
    structure: rodillaStructure,
    content: { es: rodillaContentEs, en: rodillaContentEn },
  },
  tobillo: {
    structure: tobilloStructure,
    content: { es: tobilloContentEs, en: tobilloContentEn },
  },
};

/** Zonas con test disponible (orden de inserción del registro). */
export const AVAILABLE_ZONES = Object.keys(REGISTRY) as BodyZoneId[];

/**
 * Ensambla el TestDefinition de una zona en el locale pedido. Devuelve null si
 * la zona no tiene test. El locale por defecto es 'es'.
 */
export function getTest(
  zoneId: BodyZoneId,
  locale: Locale = "es"
): TestDefinition | null {
  const entry = REGISTRY[zoneId];
  if (!entry) return null;
  return assembleTest(entry.structure, entry.content[locale]);
}
