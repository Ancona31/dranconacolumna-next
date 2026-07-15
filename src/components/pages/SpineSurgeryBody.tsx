import Link from "next/link";
import Image from "next/image";
import { Microscope, Wrench, Syringe, Monitor } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import type { Locale } from "@/lib/i18n/types";
import { waMessage } from "@/lib/i18n";
import { routeFor } from "@/lib/i18n/slug-map";
import { getSpineContent } from "@/lib/i18n/pages/spine-surgery";

const TECH_ICONS = [Microscope, Wrench, Syringe, Monitor];

export default function SpineSurgeryBody({ locale }: { locale: Locale }) {
  const c = getSpineContent(locale);
  const whatsappLink = buildWhatsAppLink(waMessage(locale, c.whatsappMessage));

  return (
    <>
      {/* Hero de página */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <Reveal>
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {c.hero.eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
              {c.hero.h1}
            </h1>
            <p className="mt-5 max-w-3xl font-body text-lg text-ink/80">
              {c.hero.text}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/quirofano-2.jpg"
                alt="Cirugía endoscópica de columna: el monitor muestra la visión del endoscopio en tiempo real"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cuándo se considera la cirugía */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {c.when.h2}
            </h2>
            <p className="mt-6 font-body text-ink/75">{c.when.text}</p>
          </Reveal>
        </div>
      </section>

      {/* Técnicas de mínima invasión */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {c.techniques.h2}
            </h2>
            <p className="mt-6 max-w-3xl font-body text-ink/75">
              {c.techniques.intro}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {c.techniques.cards.map((card, i) => {
              const Icon = TECH_ICONS[i];
              return (
                <Reveal key={card.title} delay={i * 80} className="flex">
                  <div className="flex flex-1 flex-col rounded-2xl border border-primary/10 bg-background p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-bold text-primary">
                      {card.title}
                    </h3>
                    <p className="mt-3 font-body text-ink/75">{card.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <p className="mt-8 max-w-3xl font-body text-sm text-ink/60">
              {c.techniques.closing}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cómo es la recuperación */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {c.recovery.h2}
            </h2>
            <p className="mt-6 font-body text-ink/75">{c.recovery.text}</p>
          </Reveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-white">
              {c.cta.h2}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-white/80">
              {c.cta.sub}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={routeFor("/evaluacion", locale)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 font-body text-base font-semibold text-primary transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                {c.cta.evaluationCta}
              </Link>
              <WhatsAppLink
                href={whatsappLink}
                origen="cirugia_cta"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                {c.cta.whatsappCta}
              </WhatsAppLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
