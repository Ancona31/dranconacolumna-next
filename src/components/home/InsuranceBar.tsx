import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

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

export default function InsuranceBar() {
  return (
    <section className="border-t border-ink/10 bg-primary-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <div className="text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Cobertura
            </p>
            <h2 className="mt-2 font-heading text-4xl font-extrabold text-primary">
              Trabajo con tu Seguro de Gastos Médicos Mayores
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-ink/70">
              ¿Tienes seguro de gastos médicos? Te ayudo con el trámite.
            </p>
          </div>
        </Reveal>

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
                <span className="mt-3 text-center font-body text-xs text-ink/55">
                  {aseguradora.nombre}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
