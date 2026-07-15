import { Fragment } from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, MessageCircle, Navigation } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SEDES, type Sede } from "@/lib/sedes";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import type { Locale } from "@/lib/i18n/types";
import { waMessage } from "@/lib/i18n";
import { getHomeContent } from "@/lib/i18n/pages/home";
import { getSedesCopy, type SedesCopy } from "@/lib/i18n/content/sedes";
import { routeFor } from "@/lib/i18n/slug-map";

function SedeCard({
  sede,
  copy,
  locale,
}: {
  sede: Sede;
  copy: SedesCopy;
  locale: Locale;
}) {
  const sc = copy.byId[sede.id];
  const whatsappLink = buildWhatsAppLink(
    waMessage(locale, `Hola Dr. Ancona, quiero agendar una consulta en ${sede.nombre}.`)
  );

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

      <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
        <a
          href={`tel:+52${sede.telefono}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-5 py-3 font-body text-sm font-semibold text-primary transition duration-150 hover:bg-primary hover:text-white active:scale-[0.985]"
        >
          <Phone className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {copy.callButton}
        </a>

        <WhatsAppLink
          href={whatsappLink}
          origen={sede.origen}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-body text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
        >
          <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {copy.whatsappButton}
        </WhatsAppLink>

        <a
          href={sede.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 font-body text-sm font-semibold text-accent hover:underline"
        >
          <Navigation className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {copy.directionsLink}
        </a>
      </div>
    </div>
  );
}

export default function Locations({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).locations;
  const copy = getSedesCopy(locale);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <h2 className="text-center font-heading text-3xl font-bold text-primary">
            {c.h2}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SEDES.map((sede, i) => (
            <Reveal key={sede.id} delay={i * 80} className="flex">
              <SedeCard sede={sede} copy={copy} locale={locale} />
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={routeFor("/contacto", locale)}
            className="inline-flex font-body text-sm font-semibold text-accent hover:underline"
          >
            {c.seeContact}
          </Link>
        </div>
      </div>
    </section>
  );
}
