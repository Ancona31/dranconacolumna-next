import type { Metadata } from "next";
import ContactBody from "@/components/pages/ContactBody";
import { getContactContent } from "@/lib/i18n/pages/contact";
import { buildAlternates } from "@/lib/i18n/alternates";

export const metadata: Metadata = {
  ...getContactContent("es").metadata,
  alternates: buildAlternates("/contacto", "es"),
};

export default function ContactoPage() {
  return <ContactBody locale="es" />;
}
