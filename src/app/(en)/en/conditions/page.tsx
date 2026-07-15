import type { Metadata } from "next";
import ConditionsBodyMap from "@/components/home/ConditionsBodyMap";

export const metadata: Metadata = {
  title: { absolute: "Conditions I Treat | Dr. Angel Ancona · Mérida, Mexico" },
  description:
    "Spine and orthopedic conditions treated by Dr. Angel Ancona in Mérida, Mexico: herniated disc, sciatica, stenosis, joint pain, and more. Free assessment.",
};

export default function ConditionsIndexPage() {
  return <ConditionsBodyMap locale="en" headingAs="h1" />;
}
