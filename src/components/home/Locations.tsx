import { MapPin } from "lucide-react";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import Reveal from "@/components/ui/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { LOCATIONS } from "@/lib/locations";

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
          {LOCATIONS.map((loc, i) => {
            const link = buildWhatsAppLink(
              `Hola Dr. Ancona, quiero agendar una valoración en ${loc.ciudad}.`
            );
            return (
              <Reveal key={loc.ciudad} delay={i * 80} className="flex">
                <div className="flex flex-1 flex-col rounded-2xl border border-primary/10 bg-background p-6">
                  <PhotoPlaceholder
                    label="Mini-mapa"
                    className="aspect-[16/9] w-full"
                  />
                  <h3 className="mt-5 flex items-center gap-2 font-heading text-xl font-bold text-primary">
                    <MapPin className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                    {loc.ciudad}
                  </h3>
                  <p className="mt-2 font-body text-sm text-ink/70">
                    {loc.direccion}
                  </p>
                  <p className="font-body text-sm text-ink/70">{loc.horario}</p>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full rounded-full bg-whatsapp py-3 text-center font-body text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Agendar en {loc.ciudad}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
