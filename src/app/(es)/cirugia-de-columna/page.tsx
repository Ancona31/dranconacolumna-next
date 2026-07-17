import type { Metadata } from "next";
import SpineSurgeryBody from "@/components/pages/SpineSurgeryBody";
import { getSpineContent } from "@/lib/i18n/pages/spine-surgery";
import { buildAlternates } from "@/lib/i18n/alternates";

export const metadata: Metadata = {
  ...getSpineContent("es").metadata,
  alternates: buildAlternates("/cirugia-de-columna", "es"),
};

export default function CirugiaDeColumnaPage() {
  return <SpineSurgeryBody locale="es" />;
}
