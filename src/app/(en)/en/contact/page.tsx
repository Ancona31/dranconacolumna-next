import type { Metadata } from "next";
import ContactBody from "@/components/pages/ContactBody";
import { getContactContent } from "@/lib/i18n/pages/contact";

export const metadata: Metadata = getContactContent("en").metadata;

export default function ContactPage() {
  return <ContactBody locale="en" />;
}
