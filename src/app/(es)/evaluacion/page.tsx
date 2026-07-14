import type { Metadata } from "next";
import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import EvaluationFlow from "@/components/evaluacion/EvaluationFlow";

export const metadata: Metadata = {
  title: "Evaluación gratuita de tu dolor",
  description:
    "Señala dónde te duele, responde una evaluación clínica validada y recibe tu reporte explicado al momento. Gratis y sin registro.",
};

const VALID_ZONES: BodyZoneId[] = [
  "cuello",
  "espalda-alta",
  "espalda-baja",
  "hombro",
  "codo",
  "muneca",
  "cadera",
  "rodilla",
  "tobillo",
];

export default async function EvaluacionPage({
  searchParams,
}: {
  searchParams: Promise<{ zona?: string }>;
}) {
  const { zona } = await searchParams;
  const initialZone =
    zona && VALID_ZONES.includes(zona as BodyZoneId)
      ? (zona as BodyZoneId)
      : undefined;

  return <EvaluationFlow initialZone={initialZone} />;
}
