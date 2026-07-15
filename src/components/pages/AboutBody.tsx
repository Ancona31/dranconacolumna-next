import Link from "next/link";
import Image from "next/image";
import { GraduationCap, BadgeCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import {
  DOCTOR_FULL_NAME,
  CEDULA_PROFESIONAL,
  CEDULA_ESPECIALIDAD,
} from "@/lib/config";
import type { Locale } from "@/lib/i18n/types";
import { waMessage } from "@/lib/i18n";
import { routeFor } from "@/lib/i18n/slug-map";
import { getAboutContent } from "@/lib/i18n/pages/about";

export default function AboutBody({ locale }: { locale: Locale }) {
  const c = getAboutContent(locale);
  const whatsappLink = buildWhatsAppLink(waMessage(locale, c.whatsappMessage));

  return (
    <>
      {/* Hero de página */}
      <section className="bg-primary-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <Reveal>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/dr-ancona-perfil.jpg"
                alt="Dr. Angel M. Ancona Pérez, ortopedista y traumatólogo"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {c.hero.eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
              {DOCTOR_FULL_NAME}
            </h1>
            <p className="mt-3 font-body text-lg text-ink/80">
              {c.hero.subtitle}
            </p>
            <p className="mt-5 font-body text-ink/75">{c.hero.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* Mi manera de trabajar */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {c.work.h2}
            </h2>
            <div className="mt-6 space-y-5 font-body text-ink/75">
              {c.work.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Formación */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {c.training.h2}
            </h2>
            <ul className="mt-6 space-y-4">
              {c.training.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <GraduationCap
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-body text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Certificaciones y membresías */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {c.certs.h2}
            </h2>
            <ul className="mt-6 space-y-4">
              {c.certs.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <BadgeCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-body text-ink/80">{item}</span>
                </li>
              ))}
              <li className="flex gap-3">
                <BadgeCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="font-body text-ink/80">
                  {c.certs.cedulaProf} {CEDULA_PROFESIONAL} · {c.certs.cedulaEsp}{" "}
                  {CEDULA_ESPECIALIDAD}
                </span>
              </li>
            </ul>
            <p className="mt-6 font-body text-sm text-ink/60">
              {c.certs.surgeries}
            </p>
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
                origen="sobre_mi"
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
