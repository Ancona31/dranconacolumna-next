import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SedeCard from "@/components/sedes/SedeCard";
import { SEDES } from "@/lib/sedes";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";
import { getSedesCopy } from "@/lib/i18n/content/sedes";
import { routeFor } from "@/lib/i18n/slug-map";

export default function Locations({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).locations;
  const copy = getSedesCopy(locale);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-center font-heading text-3xl font-bold text-primary">
          {c.h2}
        </h2>

        <div className="mt-10 mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {SEDES.map((sede) => (
            <Reveal key={sede.id} className="flex">
              <SedeCard
                sede={sede}
                copy={copy}
                locale={locale}
                variant="home"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={routeFor("/contacto", locale)}
            className="inline-flex min-h-11 items-center font-body text-sm font-semibold text-accent hover:underline"
          >
            {c.seeContact}
          </Link>
        </div>
      </div>
    </section>
  );
}
