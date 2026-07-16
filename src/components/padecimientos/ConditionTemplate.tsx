import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Check } from "lucide-react";
import ButtonLink from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import HeroZoneFigure from "@/components/padecimientos/HeroZoneFigure";
import StickyCtaBar from "@/components/padecimientos/StickyCtaBar";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import ShareButton from "@/components/share/ShareButton";
import {
  CEDULA_ESPECIALIDAD,
  CEDULA_PROFESIONAL,
  DOCTOR_FULL_NAME,
  SITE_URL,
} from "@/lib/config";
import type { Padecimiento } from "@/lib/padecimientos";
import { waMessage } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/types";
import { assessmentHref } from "@/lib/i18n/slug-map";
import { getConditionsUi, type ConditionsUi } from "@/lib/i18n/pages/conditions";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Foto real del bloque "Cómo lo trato yo", según el grupo del padecimiento.
const COMO_LO_TRATO_FOTO: Record<Padecimiento["grupo"], string> = {
  columna: "/images/quirofano-2.jpg",
  ortopedia: "/images/quirofano-fractura.jpg",
};

function buildJsonLd(p: Padecimiento, ui: ConditionsUi) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: p.metaTitle,
    description: p.metaDescription,
    inLanguage: ui.jsonLdLang,
    about: {
      "@type": "MedicalCondition",
      name: p.nombre,
    },
    reviewedBy: {
      "@type": "Physician",
      name: DOCTOR_FULL_NAME,
      identifier: [
        {
          "@type": "PropertyValue",
          name: "Cédula profesional",
          value: CEDULA_PROFESIONAL,
        },
        {
          "@type": "PropertyValue",
          name: "Cédula de especialidad",
          value: CEDULA_ESPECIALIDAD,
        },
      ],
    },
  };
}

/**
 * Plantilla compartida de una página de padecimiento. Renderiza el contenido
 * de `p` con los labels de UI del `locale`. La misma plantilla sirve a
 * /padecimientos/[slug] (ES) y /en/conditions/[slug] (EN): el contenido viene
 * de registros distintos por idioma, la estructura y los estilos son idénticos.
 */
export default function ConditionTemplate({
  p,
  locale,
}: {
  p: Padecimiento;
  locale: Locale;
}) {
  const ui = getConditionsUi(locale);

  const whatsappLink = buildWhatsAppLink(
    waMessage(
      locale,
      `Hola Dr. Ancona, leí sobre ${p.nombre} y quiero una valoración.`
    )
  );
  // Sin zona (padecimientos paraguas) el test arranca en el mapa corporal.
  // ES: /evaluacion?zona=… · EN: /en/assessment?zone=… (id de zona interno).
  const evaluacionHref = assessmentHref(locale, p.testZone);
  // Texto del bloque post-síntomas: "tu {zona}" en minúsculas, o "tu zona".
  const zonaMinuscula = p.zonaChip ? p.zonaChip.toLowerCase() : "zona";
  const fotoComoLoTrato = COMO_LO_TRATO_FOTO[p.grupo];

  // En EN la silueta muestra la zona traducida (el chip del padecimiento); en
  // ES la silueta conserva su etiqueta interna (BODY_ZONES), sin override.
  const zoneCaption =
    locale === "en" && p.zonaChip
      ? `${ui.zoneCaptionPrefix}: ${p.zonaChip}`
      : undefined;
  const zoneAria =
    locale === "en" && p.zonaChip
      ? `${ui.zoneAriaBefore}${zonaMinuscula}${ui.zoneAriaAfter}`
      : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(p, ui)) }}
      />

      {/* Hero: contenido + silueta de zona (una columna si no hay testZone) */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div
            className={
              p.testZone
                ? "grid items-center gap-10 md:grid-cols-[1.4fr_1fr]"
                : "max-w-3xl"
            }
          >
            <Reveal>
              <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                <Link href={ui.breadcrumbHref} className="hover:underline">
                  {ui.breadcrumbLabel}
                </Link>
                <span aria-hidden="true"> · </span>
                {ui.groupLabel[p.grupo]}
              </p>
              <h1 className="mt-2 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
                {p.nombre}
              </h1>

              {(p.zonaChip || p.statChip) && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {p.zonaChip && (
                    <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 font-body text-xs font-semibold text-primary ring-1 ring-primary/15">
                      {p.zonaChip}
                    </span>
                  )}
                  {p.statChip && (
                    <span className="inline-flex items-center rounded-full bg-[#EAF4EF] px-3 py-1 font-body text-xs font-semibold text-success">
                      {p.statChip}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-6 space-y-4">
                {p.definicion.map((parrafo) => (
                  <p key={parrafo} className="font-body text-lg text-ink/80">
                    {parrafo}
                  </p>
                ))}
              </div>

              <div className="mt-8">
                <ButtonLink href={evaluacionHref} size="lg">
                  {p.testCtaLabel}
                </ButtonLink>
                <p className="mt-3 font-body text-sm text-ink/60">
                  {ui.heroMetaLine}
                  <WhatsAppLink
                    href={whatsappLink}
                    origen="padecimiento_cta"
                    className="font-semibold text-accent hover:underline"
                  >
                    {ui.heroWaLinkText}
                  </WhatsAppLink>
                </p>
              </div>
            </Reveal>

            {p.testZone && (
              <Reveal delay={120}>
                <HeroZoneFigure
                  testZone={p.testZone}
                  caption={zoneCaption}
                  ariaLabel={zoneAria}
                />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Síntomas comunes */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {ui.symptomsH2}
            </h2>
            <ul className="mt-6 space-y-4">
              {p.sintomas.map((sintoma) => (
                <li key={sintoma} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="font-body text-ink/75">{sintoma}</span>
                </li>
              ))}
            </ul>

            {/* Puente al test: mide limitación, no confirma diagnóstico. */}
            <div className="mt-10 flex flex-col gap-4 rounded-xl bg-primary-soft p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body text-ink/80">
                {ui.bridgeBefore}
                {zonaMinuscula}
                {ui.bridgeAfter}
              </p>
              <Link
                href={evaluacionHref}
                className="inline-flex flex-none items-center justify-center rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                {p.testCtaLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Señales de alarma */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 pb-14 md:pb-20">
          <Reveal>
            <div className="rounded-2xl border-l-4 border-danger bg-[#F9EAE8] p-6 md:p-8">
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className="h-6 w-6 flex-none text-danger"
                  strokeWidth={1.75}
                />
                <h2 className="font-heading text-2xl font-bold text-primary">
                  {ui.whenToWorryH2}
                </h2>
              </div>

              {p.cuandoPreocuparse.intro && (
                <p className="mt-4 font-body text-ink/75">
                  {p.cuandoPreocuparse.intro}
                </p>
              )}

              <ul className="mt-4 space-y-3">
                {p.cuandoPreocuparse.señales.map((señal) => (
                  <li key={señal} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-danger"
                    />
                    <span className="font-body text-ink/80">{señal}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 font-body text-sm italic text-ink/70">
                {ui.warningFooter}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Opciones de tratamiento: escalera conectada, del más simple al último */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {ui.treatmentH2}
            </h2>
            <p className="mt-2 font-body text-ink/70">{ui.treatmentIntro}</p>
          </Reveal>

          <div className="relative mt-8">
            {/* Conector sutil entre pasos (solo desktop). */}
            <div
              aria-hidden="true"
              className="absolute inset-x-8 top-8 hidden h-px bg-primary/15 md:block"
            />
            <ol className="relative grid gap-6 md:grid-cols-3">
              {p.tratamiento.map((paso, i) => (
                <Reveal key={paso.titulo} delay={i * 80}>
                  <li className="h-full rounded-2xl border border-primary/10 bg-background p-6">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white ring-4 ring-background"
                    >
                      {i + 1}
                    </span>
                    <p className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {ui.stepLabel} {i + 1}
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-bold text-primary">
                      {paso.titulo}
                    </h3>
                    <p className="mt-2 font-body text-ink/75">{paso.texto}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Cómo lo trato yo: la firma, banda de ancho completo */}
      <section className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <Reveal>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl md:aspect-[4/5]">
                <Image
                  src={fotoComoLoTrato}
                  alt={`${ui.imageAltBefore}${p.nombre}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-background/70">
                {ui.howITreatEyebrow}
              </p>
              <blockquote className="mt-4 font-heading text-[22px] font-semibold leading-snug text-background md:text-2xl">
                «{p.citaDoctor}»
              </blockquote>
              <p className="mt-5 font-heading text-sm font-semibold text-background">
                {DOCTOR_FULL_NAME} — {ui.doctorRole}
              </p>
              <p className="mt-1 font-body text-[9px] uppercase tracking-wide text-background/80">
                {ui.cedProf} {CEDULA_PROFESIONAL} · {ui.cedEsp}{" "}
                {CEDULA_ESPECIALIDAD}
              </p>
              <div className="mt-6 space-y-4">
                {p.comoLoTrato.map((parrafo) => (
                  <p
                    key={parrafo}
                    className="font-body text-background/[0.92]"
                  >
                    {parrafo}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {ui.faqH2}
            </h2>
          </Reveal>

          <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {p.faq.map((item, i) => (
              <Reveal key={item.pregunta} delay={i * 60}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-base font-semibold text-primary [&::-webkit-details-marker]:hidden">
                    {item.pregunta}
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex-none font-body text-xl leading-none text-accent transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 font-body text-ink/75">
                    {item.respuesta}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>

          {/* Compartir discreto: cerca del final del contenido, antes del CTA. */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6">
            <p className="font-body text-sm text-ink/60">{ui.sharePrompt}</p>
            <ShareButton
              url={`${SITE_URL}${ui.pathBase}/${p.slug}`}
              title={`${p.nombre}${ui.shareTitleAfter}`}
              text={`${ui.shareTextBefore}${p.nombre}${ui.shareTextAfter}`}
              label={ui.shareLabel}
              origen="padecimiento"
            />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-white">
              {ui.finalCtaH2}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-white/80">
              {p.testCtaQuestion}
              {ui.finalCtaSubSuffix}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={evaluacionHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 font-body text-base font-semibold text-primary transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                {p.testCtaLabel}
              </Link>
              <WhatsAppLink
                href={whatsappLink}
                origen="padecimiento_cta"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                {ui.finalWaButton}
              </WhatsAppLink>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyCtaBar
        nombre={p.nombre}
        testCtaLabel={p.testCtaLabel}
        evaluacionHref={evaluacionHref}
        whatsappLink={whatsappLink}
        reminderText={ui.stickyReminder}
      />
    </>
  );
}
