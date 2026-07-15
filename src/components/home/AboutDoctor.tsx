import Image from "next/image";
import ButtonLink from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { DOCTOR_FULL_NAME } from "@/lib/config";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";
import { routeFor } from "@/lib/i18n/slug-map";

export default function AboutDoctor({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).about;

  return (
    <section className="bg-primary-soft">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/dr-ancona-perfil.jpg"
              alt="Retrato profesional del Dr. Angel Ancona"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="font-heading text-3xl font-bold text-primary">
            {DOCTOR_FULL_NAME}
          </h2>
          <p className="mt-4 font-body text-ink/80">{c.text}</p>
          <div className="mt-6">
            <ButtonLink href={routeFor("/sobre-mi", locale)} variant="outline">
              {c.cta}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
