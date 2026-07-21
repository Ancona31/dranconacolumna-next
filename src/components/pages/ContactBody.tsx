import { Fragment } from "react";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import PhoneLink from "@/components/analytics/PhoneLink";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SEDES, type Sede } from "@/lib/sedes";
import {
  SITE_URL,
  DOCTOR_FULL_NAME,
  CEDULA_PROFESIONAL,
  CEDULA_ESPECIALIDAD,
} from "@/lib/config";
import type { Locale } from "@/lib/i18n/types";
import { waMessage } from "@/lib/i18n";
import { getContactContent } from "@/lib/i18n/pages/contact";
import { getSedesCopy, type SedesCopy } from "@/lib/i18n/content/sedes";

// Días laborables para openingHoursSpecification (schema.org acepta el nombre
// en inglés). Ambas sedes atienden de lunes a viernes.
const DIAS_LABORABLES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/**
 * Grafo JSON-LD para SEO local: el médico y sus dos consultorios, construido
 * desde SEDES y la config para no duplicar los datos de contacto.
 *
 * Es la MISMA entidad real en ambos idiomas, así que los @id no cambian por
 * locale: solo se traduce el texto libre (description del médico y nombre del
 * consejo). El resto del grafo —direcciones, geo, teléfonos, horarios, @type—
 * es data neutra y queda idéntica. En ES el grafo es byte-idéntico al previo.
 */
function buildContactJsonLd(locale: Locale) {
  const physicianId = `${SITE_URL}/#physician`;

  const physician = {
    "@type": "Physician",
    "@id": physicianId,
    name: DOCTOR_FULL_NAME,
    description:
      locale === "en"
        ? "Orthopedic surgeon, fellowship-trained in spine surgery. Seeing patients by appointment in Mérida and Umán, Yucatán, Mexico."
        : "Ortopedista, traumatólogo y cirujano de columna. Atiende con cita previa en Mérida y Umán, Yucatán.",
    url: SITE_URL,
    medicalSpecialty: ["Musculoskeletal", "Surgical"],
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
    memberOf: {
      "@type": "MedicalOrganization",
      name:
        locale === "en"
          ? "Mexican Board of Orthopedics and Traumatology"
          : "Consejo Mexicano de Ortopedia y Traumatología, A.C.",
    },
    department: SEDES.map((sede) => ({ "@id": `${SITE_URL}/#clinic-${sede.id}` })),
  };

  const clinics = SEDES.map((sede) => ({
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#clinic-${sede.id}`,
    name: sede.nombre,
    address: {
      "@type": "PostalAddress",
      streetAddress: sede.direccion,
      addressLocality: sede.localidad,
      postalCode: sede.cp,
      addressRegion: sede.region,
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: sede.lat,
      longitude: sede.lng,
    },
    telephone: `+52${sede.telefono}`,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DIAS_LABORABLES,
      opens: sede.opens,
      closes: sede.closes,
    },
    parentOrganization: { "@id": physicianId },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [physician, ...clinics],
  };
}

function SedeCard({ sede, copy }: { sede: Sede; copy: SedesCopy }) {
  const sc = copy.byId[sede.id];
  const whatsappLink = buildWhatsAppLink(copy.whatsappMessage, sede.whatsapp);

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-primary/10 bg-background p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-heading text-xl font-bold text-primary">
          {sede.nombre}
        </h3>
        <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 font-body text-xs font-semibold text-primary ring-1 ring-primary/15">
          {sc.horarioCorto}
        </span>
      </div>

      <p className="mt-4 flex items-start gap-2 font-body text-sm text-ink/75">
        <MapPin
          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span>
          {sc.addressLines.map((line, idx) => (
            <Fragment key={idx}>
              {idx > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </span>
      </p>

      <p className="mt-3 flex items-start gap-2 font-body text-sm text-ink/75">
        <Clock
          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span>
          {copy.bookingLabel} · {sc.horario}
        </span>
      </p>

      <div className="mt-6 overflow-hidden rounded-xl">
        <iframe
          src={`https://maps.google.com/maps?q=${sede.lat},${sede.lng}&z=16&output=embed`}
          title={`${copy.mapTitlePrefix} ${sede.nombre}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-video w-full border-0"
        />
      </div>

      <a
        href={sede.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex font-body text-sm font-semibold text-accent hover:underline"
      >
        {copy.mapsLink}
      </a>

      <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
        <div>
          <PhoneLink
            href={`tel:+52${sede.telefono}`}
            section={sede.section}
            phoneNumber={sede.telefono}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-5 py-3 font-body text-sm font-semibold text-primary transition duration-150 hover:bg-primary hover:text-white active:scale-[0.985]"
          >
            <Phone className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {copy.callButton}
          </PhoneLink>
          <p className="mt-1.5 text-center font-body text-xs text-ink/55">
            {copy.forOfficeInfo}
          </p>
        </div>

        <WhatsAppLink
          href={whatsappLink}
          section={sede.section}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-body text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
        >
          <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {copy.whatsappButton}
        </WhatsAppLink>
      </div>
    </div>
  );
}

export default function ContactBody({ locale }: { locale: Locale }) {
  const c = getContactContent(locale);
  const copy = getSedesCopy(locale);
  const whatsappPrincipal = buildWhatsAppLink(
    waMessage(locale, c.mainWhatsappMessage)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildContactJsonLd(locale)),
        }}
      />

      {/* Hero de página */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {c.hero.eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
              {c.hero.h1}
            </h1>
            <p className="mt-5 font-body text-lg text-ink/80">{c.hero.text}</p>
          </Reveal>
        </div>
      </section>

      {/* CTA WhatsApp principal */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 pt-14 md:pt-20">
          <Reveal>
            <div className="rounded-2xl border border-whatsapp/25 bg-[#EAF4EF] p-6 text-center md:p-8">
              <WhatsAppLink
                href={whatsappPrincipal}
                section="ubicaciones"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                {c.cta.button}
              </WhatsAppLink>
              <p className="mt-4 font-body text-sm text-ink/70">{c.cta.sub}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Grid de sedes */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {SEDES.map((sede, i) => (
              <Reveal key={sede.id} delay={i * 80} className="flex">
                <SedeCard sede={sede} copy={copy} />
              </Reveal>
            ))}
          </div>

          {/* Nota de cierre */}
          <p className="mx-auto mt-12 max-w-xl text-center font-body text-sm text-ink/60">
            {c.closing}
          </p>
        </div>
      </section>
    </>
  );
}
