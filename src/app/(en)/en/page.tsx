import type { Metadata } from "next";
import HeroBodyMap from "@/components/home/HeroBodyMap";
import TrustBar from "@/components/home/TrustBar";
import HowItWorks from "@/components/home/HowItWorks";
import Differentiators from "@/components/home/Differentiators";
import ConditionsBodyMap from "@/components/home/ConditionsBodyMap";
import AboutDoctor from "@/components/home/AboutDoctor";
import GoogleReviews from "@/components/home/GoogleReviews";
import InsuranceBar from "@/components/home/InsuranceBar";
import Locations from "@/components/home/Locations";
import { getHomeContent } from "@/lib/i18n/pages/home";

export const metadata: Metadata = getHomeContent("en").metadata;

export default function EnHomePage() {
  return (
    <>
      <HeroBodyMap locale="en" />
      <TrustBar locale="en" />
      <HowItWorks locale="en" />
      <Differentiators locale="en" />
      <ConditionsBodyMap locale="en" />
      <AboutDoctor locale="en" />
      <GoogleReviews locale="en" />
      <InsuranceBar locale="en" />
      <Locations locale="en" />
    </>
  );
}
