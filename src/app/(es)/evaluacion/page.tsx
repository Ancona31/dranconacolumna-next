import type { Metadata } from "next";
import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import EvaluationFlow from "@/components/evaluacion/EvaluationFlow";
import { AVAILABLE_ZONES } from "@/lib/evaluacion/tests";

export const metadata: Metadata = {
  title: "Evaluación gratuita de tu dolor",
  description:
    "Señala dónde te duele, responde una evaluación clínica validada y recibe tu reporte explicado al momento. Gratis y sin registro.",
};

export default async function EvaluacionPage({
  searchParams,
}: {
  searchParams: Promise<{ zona?: string }>;
}) {
  const { zona } = await searchParams;
  const initialZone =
    zona && AVAILABLE_ZONES.includes(zona as BodyZoneId)
      ? (zona as BodyZoneId)
      : undefined;

  return <EvaluationFlow initialZone={initialZone} />;
}
