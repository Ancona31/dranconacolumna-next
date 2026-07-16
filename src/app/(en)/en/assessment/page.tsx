import type { Metadata } from "next";
import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import EvaluationFlow from "@/components/evaluacion/EvaluationFlow";
import { AVAILABLE_ZONES } from "@/lib/evaluacion/tests";

// noindex heredado del layout (en) mientras el contenido EN está en curso (F3).
export const metadata: Metadata = {
  title: "Free Pain Assessment",
  description:
    "Point to where it hurts, answer a validated clinical questionnaire, and get your report explained instantly. Free, no sign-up.",
};

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ zone?: string }>;
}) {
  // Espejo de /evaluacion: acepta ?zone= (inglés) con el MISMO id interno de
  // zona (los BodyZoneId no cambian entre idiomas; el parámetro es cosmético).
  const { zone } = await searchParams;
  const initialZone =
    zone && AVAILABLE_ZONES.includes(zone as BodyZoneId)
      ? (zone as BodyZoneId)
      : undefined;

  return <EvaluationFlow initialZone={initialZone} locale="en" />;
}
