import type { Padecimiento } from "../types";
import { herniatedDisc } from "./herniated-disc";
import { sciatica } from "./sciatica";
import { lumbarSpinalStenosis } from "./lumbar-spinal-stenosis";
import { slippedVertebra } from "./slipped-vertebra";
import { scoliosis } from "./scoliosis";
import { spinalFractures } from "./spinal-fractures";
import { neckPain } from "./neck-pain";
import { shoulderPain } from "./shoulder-pain";
import { elbowPain } from "./elbow-pain";
import { kneePain } from "./knee-pain";
import { hipPain } from "./hip-pain";
import { wristAndHandPain } from "./wrist-and-hand-pain";
import { fracturesSprains } from "./fractures-sprains";
import { sportsInjuries } from "./sports-injuries";

/**
 * Registro de padecimientos en inglés (FASE 2.B–2.C). Mismo tipo `Padecimiento`
 * y misma plantilla que el ES; el contenido es la traducción curada del brief.
 * Un slug presente aquí se renderiza con `ConditionTemplate` en
 * /en/conditions/[slug]; un slug ausente cae en notFound().
 *
 * Los 14 padecimientos ya están traducidos: el índice /en/conditions y
 * ConditionsBodyMap enlazan 14/14 a su ruta EN.
 */
export const PADECIMIENTOS_EN: Record<string, Padecimiento> = {
  "herniated-disc": herniatedDisc,
  sciatica: sciatica,
  "lumbar-spinal-stenosis": lumbarSpinalStenosis,
  "slipped-vertebra": slippedVertebra,
  scoliosis: scoliosis,
  "spinal-fractures": spinalFractures,
  "neck-pain": neckPain,
  "shoulder-pain": shoulderPain,
  "elbow-pain": elbowPain,
  "knee-pain": kneePain,
  "hip-pain": hipPain,
  "wrist-and-hand-pain": wristAndHandPain,
  "fractures-sprains": fracturesSprains,
  "sports-injuries": sportsInjuries,
};

export function getPadecimientoEn(slug: string): Padecimiento | undefined {
  return PADECIMIENTOS_EN[slug];
}
