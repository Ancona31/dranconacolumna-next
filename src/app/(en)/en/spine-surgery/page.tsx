import type { Metadata } from "next";
import SpineSurgeryBody from "@/components/pages/SpineSurgeryBody";
import { getSpineContent } from "@/lib/i18n/pages/spine-surgery";

export const metadata: Metadata = getSpineContent("en").metadata;

export default function SpineSurgeryPage() {
  return <SpineSurgeryBody locale="en" />;
}
