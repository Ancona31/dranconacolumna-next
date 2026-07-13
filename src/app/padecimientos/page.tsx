import type { Metadata } from "next";
import ConditionsBodyMap from "@/components/home/ConditionsBodyMap";

export const metadata: Metadata = { title: "Padecimientos" };

export default function PadecimientosPage() {
  return <ConditionsBodyMap headingAs="h1" />;
}
