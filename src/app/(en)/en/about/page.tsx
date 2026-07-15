import type { Metadata } from "next";
import AboutBody from "@/components/pages/AboutBody";
import { getAboutContent } from "@/lib/i18n/pages/about";

export const metadata: Metadata = getAboutContent("en").metadata;

export default function AboutPage() {
  return <AboutBody locale="en" />;
}
