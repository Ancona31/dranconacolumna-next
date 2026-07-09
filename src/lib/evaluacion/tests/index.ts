import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import type { TestDefinition } from "@/lib/evaluacion/types";
import { caderaTest } from "./cadera";
import { codoTest } from "./codo";
import { cuelloTest } from "./cuello";
import { espaldaAltaTest } from "./espalda-alta";
import { espaldaBajaTest } from "./espalda-baja";
import { hombroTest } from "./hombro";
import { munecaTest } from "./muneca";
import { rodillaTest } from "./rodilla";
import { tobilloTest } from "./tobillo";

/**
 * Registro central de tests por zona. Una zona con test aquí queda activa en el
 * mapa; una zona ausente queda inhabilitada. Hoy están las nueve: el mapa está
 * completo. Agregar una zona nueva es solo añadir su archivo de datos a este mapa.
 */
export const TESTS: Partial<Record<BodyZoneId, TestDefinition>> = {
  cadera: caderaTest,
  codo: codoTest,
  cuello: cuelloTest,
  "espalda-alta": espaldaAltaTest,
  "espalda-baja": espaldaBajaTest,
  hombro: hombroTest,
  muneca: munecaTest,
  rodilla: rodillaTest,
  tobillo: tobilloTest,
};

export const AVAILABLE_ZONES = Object.keys(TESTS) as BodyZoneId[];
