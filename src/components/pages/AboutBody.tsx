import Link from "next/link";
import Image from "next/image";
import { GraduationCap, BadgeCheck } from "lucide-react";
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
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function AboutBody({ locale }: { locale: Locale }) {
  const c = getAboutContent(locale);
  const whatsappLink = buildWhatsAppLink(waMessage(locale, c.whatsappMessage));

  return (
    <>
      {/* Hero de página */}
      <section className="bg-primary-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          {/* min-w-0 en las columnas: con zoom de texto al 200 % una palabra
              larga no ensancha la rejilla (break-words parte la palabra). */}
          <div className="load-enter min-w-0">
            {/* Fondo de respaldo: si la foto falla no queda un hueco. */}
            <div className="relative bg-primary/10 mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl md:max-w-none">
              <Image
                src="/images/dr-ancona-perfil.jpg"
                alt={c.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 560px"
              />
            </div>
          </div>

          <div
            className="load-enter min-w-0 break-words"
            style={{ "--load-delay": "120ms" } as React.CSSProperties}
          >
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {c.hero.eyebrow}
            </p>
            <h1 className="break-words mt-2 font-heading text-[clamp(2.25rem,1.6rem+2.6vw,3rem)] font-extrabold leading-tight text-primary">
              {DOCTOR_FULL_NAME}
            </h1>
            <p className="mt-3 font-body text-lg text-ink/80">
              {c.hero.subtitle}
            </p>
            <p className="mt-5 font-body text-ink/75">{c.hero.intro}</p>
          </div>
        </div>
      </section>

      {/* Mi manera de trabajar */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <h2 className="break-words font-heading text-3xl font-bold text-primary">
            {c.work.h2}
          </h2>
          <div className="mt-6 space-y-5 font-body text-ink/75">
            {c.work.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Formación */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <h2 className="break-words font-heading text-3xl font-bold text-primary">
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
        </div>
      </section>

      {/* Certificaciones y membresías */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <h2 className="break-words font-heading text-3xl font-bold text-primary">
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
          <p className="mt-6 font-body text-sm text-muted">
            {c.certs.surgeries}
          </p>
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
              section="sobre_mi"
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
