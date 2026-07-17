import type { Metadata } from "next";
import ContactBody from "@/components/pages/ContactBody";
import { getContactContent } from "@/lib/i18n/pages/contact";
import { buildAlternates } from "@/lib/i18n/alternates";

export const metadata: Metadata = {
  ...getContactContent("en").metadata,
  alternates: buildAlternates("/contacto", "en"),
};

export default function ContactPage() {
  return <ContactBody locale="en" />;
}
