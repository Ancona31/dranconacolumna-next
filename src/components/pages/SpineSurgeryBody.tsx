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
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const TECH_ICONS = [Microscope, Wrench, Syringe, Monitor];

export default function SpineSurgeryBody({ locale }: { locale: Locale }) {
  const c = getSpineContent(locale);
  const whatsappLink = buildWhatsAppLink(waMessage(locale, c.whatsappMessage));

  return (
    <>
      {/* Hero de página */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="load-enter">
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {c.hero.eyebrow}
            </p>
            <h1 className="break-words mt-2 font-heading text-[clamp(2.25rem,1.6rem+2.6vw,3rem)] font-extrabold leading-tight text-primary">
              {c.hero.h1}
            </h1>
            <p className="mt-5 max-w-3xl font-body text-lg text-ink/80">
              {c.hero.text}
            </p>
          </div>
          <div
            className="load-enter"
            style={{ "--load-delay": "120ms" } as React.CSSProperties}
          >
            {/* Fondo de respaldo: si la foto falla no queda un hueco. */}
            <div className="relative bg-primary/10 mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/quirofano-2.jpg"
                alt={c.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cuándo se considera la cirugía */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <h2 className="break-words font-heading text-3xl font-bold text-primary">
            {c.when.h2}
          </h2>
          <p className="mt-6 font-body text-ink/75">{c.when.text}</p>
        </div>
      </section>

      {/* Técnicas de mínima invasión */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="break-words font-heading text-3xl font-bold text-primary">
            {c.techniques.h2}
          </h2>
          <p className="mt-6 max-w-3xl font-body text-ink/75">
            {c.techniques.intro}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {c.techniques.cards.map((card, i) => {
              const Icon = TECH_ICONS[i];
              return (
                <Reveal key={card.title} className="flex min-w-0">
                  <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-primary/10 bg-background p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="break-words mt-4 font-heading text-lg font-bold text-primary">
                      {card.title}
                    </h3>
                    <p className="mt-3 font-body break-words text-ink/75">{card.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-8 max-w-3xl font-body text-sm text-muted">
            {c.techniques.closing}
          </p>
        </div>
      </section>

      {/* Cómo es la recuperación */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <h2 className="break-words font-heading text-3xl font-bold text-primary">
            {c.recovery.h2}
          </h2>
          <p className="mt-6 font-body text-ink/75">{c.recovery.text}</p>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
          <h2 className="break-words font-heading text-3xl font-bold text-white">
            {c.cta.h2}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-white/80">
            {c.cta.sub}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={routeFor("/evaluacion", locale)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 font-body text-base font-semibold text-primary transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
            >
              {c.cta.evaluationCta}
            </Link>
            <WhatsAppLink
              href={whatsappLink}
              section="cirugia"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-4 font-body text-base font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-white/10 active:scale-[0.97]"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0 text-whatsapp" />
              {c.cta.whatsappCta}
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </>
  );
}
