import { Fragment } from "react";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import PhoneLink from "@/components/analytics/PhoneLink";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import SedeMap from "@/components/ui/SedeMap";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Sede } from "@/lib/sedes";
import type { Locale } from "@/lib/i18n/types";
import type { SedesCopy } from "@/lib/i18n/content/sedes";

// Misma receta que ButtonLink (ui/Button.tsx, tamaño md a lo ancho): aquí el
// enlace lo ponen PhoneLink / WhatsAppLink, que emiten el evento de analytics.
const BUTTON_BASE =
  "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-body text-sm font-semibold transition-[transform,background-color,color,opacity] duration-150 ease-out active:scale-[0.97]";
const BUTTON_OUTLINE = `${BUTTON_BASE} border border-primary bg-transparent text-primary hover:bg-primary hover:text-white`;
const BUTTON_PRIMARY = `${BUTTON_BASE} bg-primary text-white hover:opacity-90`;

/**
 * Con tres sedes, en tablet (2 columnas) la última tarjeta quedaría sola en
 * media fila: ocupa el ancho completo. En lg las tres van en una fila. Va en
 * el contenedor de cada tarjeta (el Reveal de la rejilla).
 */
export const SEDE_ORPHAN_SPAN = "md:last:odd:col-span-2 lg:last:odd:col-span-1";

const NOTE = "mt-1.5 text-center font-body text-xs text-muted";
const TEXT_LINK =
  "inline-flex min-h-11 items-center justify-center gap-1.5 font-body text-sm font-semibold text-accent hover:underline";

/**
 * Tarjeta de una sede. Una sola para el home (Locations) y para contacto
 * (ContactBody), así no vuelven a divergir. Lo que cambia por página va por
 * `variant`:
 *  - "home": al pie, "Cómo llegar" con ícono de navegación.
 *  - "contact": "Ver en Google Maps" bajo el mapa y la nota "Para
 *    información de la sede" bajo el botón de llamar.
 *
 * Geometría igual en todas las tarjetas de una fila (la rejilla las estira al
 * mismo alto): el chip de horario va siempre bajo el título y el bloque de
 * dirección y horario absorbe la diferencia (flex-1), así el mapa y los
 * botones quedan a la misma altura aunque una dirección ocupe más renglones.
 */
export default function SedeCard({
  sede,
  copy,
  locale,
  variant,
}: {
  sede: Sede;
  copy: SedesCopy;
  locale: Locale;
  variant: "home" | "contact";
}) {
  const sc = copy.byId[sede.id];
  const whatsappLink = buildWhatsAppLink(copy.whatsappMessage, sede.whatsapp);

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-primary/10 bg-background p-6">
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-heading text-xl font-bold text-primary">
          {sede.nombre}
        </h3>
        <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 font-body text-xs font-semibold text-primary ring-1 ring-primary/15">
          {sc.horarioCorto}
        </span>
      </div>

      <div className="mt-4 flex-1 space-y-3">
        <p className="flex items-start gap-2 font-body text-sm text-ink/75">
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

        <p className="flex items-start gap-2 font-body text-sm text-ink/75">
          <Clock
            className="mt-0.5 h-5 w-5 shrink-0 text-accent"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span>
            {copy.bookingLabel} · {sc.horario}
          </span>
        </p>
      </div>

      <SedeMap
        sede={sede}
        locale={locale}
        titlePrefix={copy.mapTitlePrefix}
        className="mt-5"
      />

      {variant === "contact" && (
        <a
          href={sede.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${TEXT_LINK} mt-1 self-start`}
        >
          {copy.mapsLink}
        </a>
      )}

      <div
        className={`flex flex-col gap-3 ${variant === "contact" ? "mt-3" : "mt-5"}`}
      >
        <div>
          <PhoneLink
            href={`tel:+52${sede.telefono}`}
            section={sede.section}
            phoneNumber={sede.telefono}
            className={BUTTON_OUTLINE}
          >
            <Phone className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {copy.callButton}
          </PhoneLink>
          {variant === "contact" && <p className={NOTE}>{copy.forOfficeInfo}</p>}
        </div>

        <div>
          <WhatsAppLink
            href={whatsappLink}
            section={sede.section}
            className={BUTTON_PRIMARY}
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp" />
            {copy.whatsappButton}
          </WhatsAppLink>
          <p className={NOTE}>
            {copy.clinicWhatsappNote} · {sede.telefonoDisplay}
          </p>
        </div>

        {variant === "home" && (
          <a
            href={sede.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={TEXT_LINK}
          >
            <Navigation className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {copy.directionsLink}
          </a>
        )}
      </div>
    </div>
  );
}
