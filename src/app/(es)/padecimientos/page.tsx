import type { Metadata } from "next";
import ConditionsBodyMap from "@/components/home/ConditionsBodyMap";
import { buildAlternates } from "@/lib/i18n/alternates";

export const metadata: Metadata = {
  title: "Padecimientos",
  alternates: buildAlternates("/padecimientos", "es"),
};

export default function PadecimientosPage() {
  return <ConditionsBodyMap locale="es" headingAs="h1" />;
}
