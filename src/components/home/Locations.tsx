import Link from "next/link";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SEDES, type Sede } from "@/lib/sedes";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";

function SedeCard({ sede }: { sede: Sede }) {
  const whatsappLink = buildWhatsAppLink(
    `Hola Dr. Ancona, quiero agendar una consulta en ${sede.nombre}.`
  );

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-primary/10 bg-background p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-heading text-xl font-bold text-primary">
          {sede.nombre}
        </h3>
        <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 font-body text-xs font-semibold text-primary ring-1 ring-primary/15">
          {sede.horarioCorto}
        </span>
      </div>

      <p className="mt-4 flex items-start gap-2 font-body text-sm text-ink/75">
        <MapPin
          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span>
          {sede.direccion}
          <br />
          {sede.ciudad} · C.P. {sede.cp}
        </span>
      </p>

      <p className="mt-3 flex items-start gap-2 font-body text-sm text-ink/75">
        <Clock
          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span>Consulta con cita previa · {sede.horario}</span>
      </p>

      <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
        <a
          href={`tel:+52${sede.telefono}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-5 py-3 font-body text-sm font-semibold text-primary transition duration-150 hover:bg-primary hover:text-white active:scale-[0.985]"
        >
          <Phone className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Llamar a la clínica
        </a>

        <WhatsAppLink
          href={whatsappLink}
          origen={sede.origen}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-body text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
        >
          <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Agendar por WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}

export default function Locations() {
  return (
    <section className="bg-primary-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <h2 className="text-center font-heading text-3xl font-bold text-primary">
            Dónde atiendo
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SEDES.map((sede, i) => (
            <Reveal key={sede.id} delay={i * 80} className="flex">
              <SedeCard sede={sede} />
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contacto"
            className="inline-flex font-body text-sm font-semibold text-accent hover:underline"
          >
            Ver información de contacto →
          </Link>
        </div>
      </div>
    </section>
  );
}
