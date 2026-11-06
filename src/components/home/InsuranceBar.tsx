import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/** Aseguradoras con las que se trabaja. Logos en public/images/aseguradoras/. */
const ASEGURADORAS: { nombre: string; archivo: string }[] = [
  { nombre: "GNP Seguros", archivo: "gnp.svg" },
  { nombre: "AXA Seguros", archivo: "axa.png" },
  { nombre: "Seguros Monterrey", archivo: "seguros-monterrey.png" },
  { nombre: "MetLife", archivo: "metlife.png" },
  { nombre: "MAPFRE", archivo: "mapfre.png" },
  { nombre: "Quálitas", archivo: "qualitas.svg" },
  { nombre: "Allianz", archivo: "allianz.svg" },
  { nombre: "BBVA Seguros", archivo: "bbva.svg" },
];

export default function InsuranceBar({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).insurance;
  const whatsappLink = buildWhatsAppLink(c.waMessage);

  return (
    <section className="border-t border-ink/10 bg-primary-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="text-center">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {c.eyebrow}
          </p>
          <h2 className="mt-2 font-heading text-4xl font-extrabold text-primary">
            {c.h2}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-ink/70">
            {c.sub}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-4">
          {ASEGURADORAS.map((aseguradora, i) => (
            <Reveal key={aseguradora.archivo} delay={i * 60} className="flex">
              <div className="flex flex-1 flex-col items-center rounded-xl border border-ink/10 bg-white p-5">
                <div className="relative h-14 w-full">
                  <Image
                    src={`/images/aseguradoras/${aseguradora.archivo}`}
                    alt={aseguradora.nombre}
                    fill
                    unoptimized
                    loading="lazy"
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="object-contain"
                  />
                </div>
                <span className="mt-3 text-center font-body text-xs text-muted">
                  {aseguradora.nombre}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-12">
          <WhatsAppLink
            href={whatsappLink}
            section="aseguradoras"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-center font-body text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.97]"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0 text-whatsapp" />
            {c.waCta}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
