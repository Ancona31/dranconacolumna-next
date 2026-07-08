import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import type { TestDefinition } from "@/lib/evaluacion/types";
import { caderaTest } from "./cadera";
import { codoTest } from "./codo";
import { espaldaBajaTest } from "./espalda-baja";
import { hombroTest } from "./hombro";
import { munecaTest } from "./muneca";
import { rodillaTest } from "./rodilla";

/**
 * Registro central de tests por zona. Una zona con test aquí queda activa en el
 * mapa; una zona ausente muestra el sheet "próximamente". Agregar una zona nueva
 * es solo añadir su archivo de datos a este mapa.
 */
export const TESTS: Partial<Record<BodyZoneId, TestDefinition>> = {
  cadera: caderaTest,
  codo: codoTest,
  "espalda-baja": espaldaBajaTest,
  hombro: hombroTest,
  muneca: munecaTest,
  rodilla: rodillaTest,
};

export const AVAILABLE_ZONES = Object.keys(TESTS) as BodyZoneId[];
