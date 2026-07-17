import type { Metadata } from "next";
import AboutBody from "@/components/pages/AboutBody";
import { getAboutContent } from "@/lib/i18n/pages/about";
import { buildAlternates } from "@/lib/i18n/alternates";

export const metadata: Metadata = {
  ...getAboutContent("es").metadata,
  alternates: buildAlternates("/sobre-mi", "es"),
};

export default function SobreMiPage() {
  return <AboutBody locale="es" />;
}
