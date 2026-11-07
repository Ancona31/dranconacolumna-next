import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/**
 * Aseguradoras con las que se trabaja. Logos en public/images/aseguradoras/.
 *
 * Peso óptico parejo: con una caja común (object-contain) los logos anchos
 * llenaban todo el ancho (MetLife, BBVA enormes) y los altos quedaban
 * diminutos (Quálitas). Cada logo lleva su alto en px, ajustado a ojo para
 * que todos ocupen un área visual parecida; `ratio` = ancho / alto del
 * archivo (incluye el margen interno que trae cada uno).
 */
const ASEGURADORAS: {
  nombre: string;
  archivo: string;
  ratio: number;
  alto: number;
}[] = [
  { nombre: "GNP Seguros", archivo: "gnp.svg", ratio: 179 / 68, alto: 44 },
  { nombre: "AXA Seguros", archivo: "axa.png", ratio: 1, alto: 46 },
  { nombre: "Seguros Monterrey", archivo: "seguros-monterrey.png", ratio: 300 / 67, alto: 34 },
  { nombre: "MetLife", archivo: "metlife.png", ratio: 353 / 76, alto: 31 },
  { nombre: "MAPFRE", archivo: "mapfre.png", ratio: 500 / 138, alto: 46 },
  { nombre: "Quálitas", archivo: "qualitas.svg", ratio: 174 / 238, alto: 62 },
  { nombre: "Allianz", archivo: "allianz.svg", ratio: 399.76 / 99.15, alto: 33 },
  { nombre: "BBVA Seguros", archivo: "bbva.svg", ratio: 600 / 179.8, alto: 29 },
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

        {/* Una columna solo en anchos mínimos (zoom de texto al 200 % en un
            celular): ahí dos tarjetas no caben sin desbordar. */}
        <div className="mt-10 grid grid-cols-1 gap-4 min-[300px]:grid-cols-2 md:mt-12 md:grid-cols-4">
          {ASEGURADORAS.map((aseguradora) => (
            <Reveal key={aseguradora.archivo} className="flex">
              <div className="flex min-w-0 flex-1 flex-col items-center rounded-xl border border-ink/10 bg-white p-5">
                {/* Caja de alto fijo (el mayor de los logos) para que los
                    nombres queden alineados; el logo se centra dentro y, en
                    tarjetas angostas, se reduce en proporción (max-w-full). */}
                <div className="flex h-16 w-full items-center justify-center">
                  <Image
                    src={`/images/aseguradoras/${aseguradora.archivo}`}
                    alt={aseguradora.nombre}
                    width={Math.round(aseguradora.alto * aseguradora.ratio)}
                    height={aseguradora.alto}
                    unoptimized
                    loading="lazy"
                    className="h-auto max-w-full"
                  />
                </div>
                <span className="mt-3 max-w-full text-center font-body text-xs break-words text-muted">
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
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-center font-body text-sm font-semibold text-white transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0 text-whatsapp" />
            {c.waCta}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
