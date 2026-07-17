import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";
import { buildAlternates } from "@/lib/i18n/alternates";

// Sin par EN: buildAlternates devuelve solo es + x-default (ambos a la ES).
export const metadata: Metadata = {
  title: "Aviso de privacidad",
  alternates: buildAlternates("/aviso-de-privacidad", "es"),
};

export default function AvisoDePrivacidadPage() {
  return <Placeholder title="Aviso de privacidad" phase={5} />;
}
