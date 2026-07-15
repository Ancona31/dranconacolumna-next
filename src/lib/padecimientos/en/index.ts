import type { Padecimiento } from "../types";
import { herniatedDisc } from "./herniated-disc";
import { sciatica } from "./sciatica";
import { lumbarSpinalStenosis } from "./lumbar-spinal-stenosis";
import { slippedVertebra } from "./slipped-vertebra";
import { scoliosis } from "./scoliosis";
import { spinalFractures } from "./spinal-fractures";
import { neckPain } from "./neck-pain";

/**
 * Registro de padecimientos en inglés (FASE 2.B). Mismo tipo `Padecimiento` y
 * misma plantilla que el ES; el contenido es la traducción curada del brief.
 * Un slug presente aquí se renderiza con `ConditionTemplate` en
 * /en/conditions/[slug]; un slug ausente cae en notFound().
 *
 * Por ahora solo el lote 1 (4 padecimientos de zona lumbar); los demás se
 * agregan aquí conforme se traducen.
 */
export const PADECIMIENTOS_EN: Record<string, Padecimiento> = {
  "herniated-disc": herniatedDisc,
  sciatica: sciatica,
  "lumbar-spinal-stenosis": lumbarSpinalStenosis,
  "slipped-vertebra": slippedVertebra,
  scoliosis: scoliosis,
  "spinal-fractures": spinalFractures,
  "neck-pain": neckPain,
};

export function getPadecimientoEn(slug: string): Padecimiento | undefined {
  return PADECIMIENTOS_EN[slug];
}
