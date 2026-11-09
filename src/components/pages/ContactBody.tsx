import Reveal from "@/components/ui/Reveal";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import SedeCard from "@/components/sedes/SedeCard";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SEDES } from "@/lib/sedes";
import {
  SITE_URL,
  DOCTOR_FULL_NAME,
  CEDULA_PROFESIONAL,
  CEDULA_ESPECIALIDAD,
} from "@/lib/config";
import type { Locale } from "@/lib/i18n/types";
import { waMessage } from "@/lib/i18n";
import { getContactContent } from "@/lib/i18n/pages/contact";
import { getSedesCopy } from "@/lib/i18n/content/sedes";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Grafo JSON-LD para SEO local: el médico y sus consultorios, construido
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
      dayOfWeek: sede.dias,
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
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="load-enter max-w-3xl">
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {c.hero.eyebrow}
            </p>
            <h1 className="break-words mt-2 font-heading text-[clamp(2.25rem,1.6rem+2.6vw,3rem)] font-extrabold leading-tight text-primary">
              {c.hero.h1}
            </h1>
            <p className="mt-5 font-body text-lg text-ink/80">{c.hero.text}</p>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp principal */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 pt-14 md:pt-20">
          <div
            className="load-enter"
            style={{ "--load-delay": "120ms" } as React.CSSProperties}
          >
            <div className="rounded-2xl border border-primary/10 bg-primary-soft p-4 text-center sm:p-6 md:p-8">
              <WhatsAppLink
                href={whatsappPrincipal}
                section="ubicaciones"
                // flex-wrap + max-w-full: con zoom de texto al 200 % el ícono baja
                // de renglón en vez de sacar el botón de la pantalla.
                className={buttonClasses({
                  variant: "whatsapp",
                  size: "lg",
                  className: "max-w-full flex-wrap",
                })}
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0 text-whatsapp" />
                {c.cta.button}
              </WhatsAppLink>
              <p className="mt-4 font-body text-sm text-ink/70">{c.cta.sub}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de sedes */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {SEDES.map((sede) => (
              <Reveal key={sede.id} className="flex">
                <SedeCard
                  sede={sede}
                  copy={copy}
                  locale={locale}
                  variant="contact"
                />
              </Reveal>
            ))}
          </div>

          {/* Nota de cierre */}
          <p className="mx-auto mt-12 max-w-xl text-center font-body text-sm text-muted">
            {c.closing}
          </p>
        </div>
      </section>
    </>
  );
}
