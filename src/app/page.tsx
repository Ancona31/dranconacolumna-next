import type { Metadata } from "next";
import HeroBodyMap from "@/components/home/HeroBodyMap";
import TrustBar from "@/components/home/TrustBar";
import HowItWorks from "@/components/home/HowItWorks";
import Differentiators from "@/components/home/Differentiators";
import ConditionsGrid from "@/components/home/ConditionsGrid";
import AboutDoctor from "@/components/home/AboutDoctor";
import GoogleReviews from "@/components/home/GoogleReviews";
import InsuranceBar from "@/components/home/InsuranceBar";
import Locations from "@/components/home/Locations";
import { PLACEHOLDER_REVIEWS } from "@/lib/reviews-placeholder";

export const metadata: Metadata = {
  title: {
    absolute:
      "Ortopedista y Traumatólogo en Mérida | Dr. Angel Ancona · Cirugía de Columna",
  },
  description:
    "Ortopedista y traumatólogo en Mérida y Umán. Alta especialidad en cirugía de columna y técnicas de mínima invasión. Haz una evaluación gratuita de tu dolor y agenda tu valoración.",
};

export default function HomePage() {
  return (
    <>
      <HeroBodyMap />
      <TrustBar />
      <HowItWorks />
      <Differentiators />
      <ConditionsGrid />
      <AboutDoctor />
      <GoogleReviews reviews={PLACEHOLDER_REVIEWS} />
      <InsuranceBar />
      <Locations />
    </>
  );
}
