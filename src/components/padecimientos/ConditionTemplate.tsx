import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Check, Plus } from "lucide-react";
import ButtonLink, {
  buttonClasses,
  PAIRED_CTA_WIDTH,
} from "@/components/ui/Button";
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
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

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
            {/* Lo primero que se ve: entra con CSS al cargar, sin esperar a
                que React hidrate (un Reveal lo dejaría en opacity 0).
                min-w-0 + break-words: con zoom de texto al 200 % una palabra
                larga no ensancha la rejilla. */}
            <div className="load-enter min-w-0 break-words">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                <Link href={ui.breadcrumbHref} className="hover:underline">
                  {ui.breadcrumbLabel}
                </Link>
                <span aria-hidden="true"> · </span>
                {ui.groupLabel[p.grupo]}
              </p>
              <h1 className="break-words mt-2 font-heading text-[clamp(2.25rem,1.6rem+2.6vw,3rem)] font-extrabold leading-tight text-primary">
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
                    <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 font-body text-xs font-semibold text-success">
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
                <p className="mt-3 font-body text-sm text-muted">
                  {ui.heroMetaLine}
                  <WhatsAppLink
                    href={whatsappLink}
                    section="padecimientos"
                    className="font-semibold text-accent hover:underline"
                  >
                    {ui.heroWaLinkText}
                  </WhatsAppLink>
                </p>
              </div>
            </div>

            {p.testZone && (
              <div
                className="load-enter"
                style={{ "--load-delay": "120ms" } as React.CSSProperties}
              >
                <HeroZoneFigure
                  testZone={p.testZone}
                  caption={zoneCaption}
                  ariaLabel={zoneAria}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Qué puede estar pasando: solo en páginas que agrupan varias patologías
          (codo, muñeca/mano). Se omite cuando p.patologias no existe → las 13
          páginas de una sola patología renderizan idéntico. */}
      {p.patologias && p.patologias.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <div className="max-w-3xl">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {ui.causesEyebrow}
              </p>
              <h2 className="break-words mt-2 font-heading text-3xl font-bold text-primary">
                {ui.causesH2}
              </h2>

              <div className="mt-8 space-y-6">
                {/* Sin Reveal: es texto clínico, se muestra de inmediato. */}
                {p.patologias.map((pat) => (
                  <article key={pat.nombre} className="rounded-2xl border border-primary/10 bg-primary-soft p-6 md:p-8">
                    <h3 className="break-words font-heading text-xl font-bold text-primary">
                      {pat.nombre}
                    </h3>
                    <div className="mt-5 space-y-5">
                      <div>
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                          {ui.pathoWhatLabel}
                        </p>
                        <p className="mt-1.5 font-body text-ink/75">
                          {pat.queEs}
                        </p>
                      </div>
                      <div>
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                          {ui.pathoFeelLabel}
                        </p>
                        <p className="mt-1.5 font-body text-ink/75">
                          {pat.comoSeSiente}
                        </p>
                      </div>
                      <div>
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                          {ui.pathoTreatLabel}
                        </p>
                        <p className="mt-1.5 font-body text-ink/75">
                          {pat.comoSeTrata}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Síntomas comunes. Siempre bg-background. Cuando hay una sección de
          patologías arriba (también bg-background) esta suelta su padding
          superior para no duplicar el espacio: el bloque queda continuo y con
          el mismo ritmo (80px) que Síntomas → Señales de alarma. Sin patologías
          (las 13 páginas) conserva el py completo tras el hero primary-soft. */}
      <section className="bg-background">
        <div
          className={`mx-auto max-w-6xl px-4 ${
            p.patologias?.length ? "pb-14 md:pb-20" : "py-14 md:py-20"
          }`}
        >
          <div className="max-w-3xl">
            <h2 className="break-words font-heading text-3xl font-bold text-primary">
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
            <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-primary/10 bg-primary-soft p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body text-ink/80">
                {ui.bridgeBefore}
                {zonaMinuscula}
                {ui.bridgeAfter}
              </p>
              <ButtonLink href={evaluacionHref} className="flex-none">
                {p.testCtaLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Señales de alarma */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-14 md:pb-20">
          {/* Sin Reveal: es información de seguridad, debe verse de inmediato
              aunque el JS tarde o falle. Recuadro tintado con borde del mismo
              tono (sin border-l-4: con esquina redondeada dibujaba un gancho). */}
          <div className="max-w-3xl rounded-2xl border border-danger/20 bg-danger/[0.08] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className="h-6 w-6 flex-none text-danger"
                strokeWidth={1.75}
              />
              <h2 className="min-w-0 break-words font-heading text-2xl font-bold text-primary">
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
        </div>
      </section>

      {/* Opciones de tratamiento: escalera conectada, del más simple al último */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="break-words font-heading text-3xl font-bold text-primary">
            {ui.treatmentH2}
          </h2>
          <p className="mt-2 font-body text-ink/70">{ui.treatmentIntro}</p>

          <div className="relative mt-8">
            {/* Conector sutil entre pasos (solo desktop). */}
            <div
              aria-hidden="true"
              className="absolute inset-x-8 top-8 hidden h-px bg-primary/15 md:block"
            />
            <ol className="relative grid gap-6 md:grid-cols-3">
              {p.tratamiento.map((paso, i) => (
                <li key={paso.titulo} className="h-full min-w-0 rounded-2xl border border-primary/10 bg-background p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white ring-4 ring-background"
                  >
                    {i + 1}
                  </span>
                  {/* El número ya va en el círculo: sin eyebrow "Paso N"
                      repetido. El lector de pantalla lo oye en el h3. */}
                  <h3 className="break-words mt-4 font-heading text-lg font-bold text-primary">
                    <span className="sr-only">
                      {ui.stepLabel} {i + 1}:{" "}
                    </span>
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 font-body text-ink/75">{paso.texto}</p>
                </li>
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
              {/* Fondo de respaldo: si la foto falla no queda un hueco. */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-white/10 md:aspect-[4/5]">
                <Image
                  src={fotoComoLoTrato}
                  alt={`${ui.imageAltBefore}${p.nombre}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 100vw, 560px"
                />
              </div>
            </Reveal>

            {/* Texto sin Reveal: contenido clínico, visible aunque el JS tarde. */}
            <div>
              <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-background/70">
                {ui.howITreatEyebrow}
              </p>
              <blockquote className="mt-4 font-heading text-[22px] font-semibold leading-snug text-background md:text-2xl">
                {ui.quoteOpen}
                {p.citaDoctor}
                {ui.quoteClose}
              </blockquote>
              <p className="mt-5 font-heading text-sm font-semibold text-background">
                {DOCTOR_FULL_NAME} — {ui.doctorRole}
              </p>
              {/* 12 px como en el resto del sitio; tabular-nums alinea los
                  números de cédula. */}
              <p className="mt-1 font-body text-xs tracking-[0.08em] text-background/75 tabular-nums">
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
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <h2 className="break-words font-heading text-3xl font-bold text-primary">
              {ui.faqH2}
            </h2>

            <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {/* Sin Reveal ni escalonado: la lista ya está a la vista al llegar
                  al encabezado. La respuesta se despliega con .faq-item
                  (globals.css). El padding vive en el summary para que toda la
                  fila sea área de toque. */}
              {p.faq.map((item) => (
                <details key={item.pregunta} className="faq-item group pb-2">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 pt-5 pb-3 font-heading text-base font-semibold text-primary [&::-webkit-details-marker]:hidden">
                    {item.pregunta}
                    {/* Ícono lucide (no un "+" de la fuente) y la misma
                        duración que el panel (250 ms, globals.css). */}
                    <Plus
                      aria-hidden="true"
                      strokeWidth={2}
                      className="mt-0.5 h-5 w-5 flex-none text-accent transition-transform duration-[250ms] ease-out group-open:rotate-45"
                    />
                  </summary>
                  <p className="pr-8 pb-3 font-body text-ink/75">
                    {item.respuesta}
                  </p>
                </details>
              ))}
            </div>

            {/* Compartir discreto: cerca del final del contenido, antes del CTA. */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6">
              <p className="font-body text-sm text-muted">{ui.sharePrompt}</p>
              <ShareButton
                url={`${SITE_URL}${ui.pathBase}/${p.slug}`}
                title={`${p.nombre}${ui.shareTitleAfter}`}
                text={`${ui.shareTextBefore}${p.nombre}${ui.shareTextAfter}`}
                label={ui.shareLabel}
                locale={locale}
                origen="padecimiento"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="break-words font-heading text-3xl font-bold text-white">
              {ui.finalCtaH2}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-white/80">
              {p.testCtaQuestion}
              {ui.finalCtaSubSuffix}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href={evaluacionHref}
                variant="onDark"
                size="lg"
                className={PAIRED_CTA_WIDTH}
              >
                {p.testCtaLabel}
              </ButtonLink>
              <WhatsAppLink
                href={whatsappLink}
                section="padecimientos"
                className={buttonClasses({
                  variant: "outlineOnDark",
                  size: "lg",
                  className: PAIRED_CTA_WIDTH,
                })}
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0 text-whatsapp" />
                {ui.finalWaButton}
              </WhatsAppLink>
            </div>
          </div>
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
