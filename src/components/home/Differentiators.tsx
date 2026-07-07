import Link from "next/link";
import { ShieldCheck, Bone, HeartHandshake } from "lucide-react";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import Reveal from "@/components/ui/Reveal";

type Card = {
  Icon: typeof ShieldCheck;
  title: string;
  text: string;
  photo: string;
  link?: { label: string; href: string };
};

const CARDS: Card[] = [
  {
    Icon: ShieldCheck,
    title: "Alta especialidad en cirugía de columna",
    text: "No todos los ortopedistas operan columna. Cursé una alta especialidad dedicada exclusivamente a ella, y cuando el caso lo permite uso técnicas de mínima invasión: incisiones más pequeñas, menos dolor y una recuperación más rápida.",
    photo: "FOTO REAL: el Dr. Ancona en quirófano durante cirugía de columna",
    link: { label: "Conocer más", href: "/cirugia-de-columna" },
  },
  {
    Icon: Bone,
    title: "Ortopedia y traumatología integral",
    text: "Fracturas, esguinces, lesiones deportivas y desgaste articular: hombro, cadera, rodilla, mano y tobillo. La misma rigurosidad para un esguince que para una cirugía compleja.",
    photo: "FOTO REAL: el Dr. Ancona explorando a un paciente en consulta",
    link: { label: "Ver padecimientos", href: "/padecimientos" },
  },
  {
    Icon: HeartHandshake,
    title: "Atención personal, de inicio a fin",
    text: "Te atiendo yo en la valoración, en el quirófano y en cada revisión — no un equipo rotativo. Mi WhatsApp responde, porque las urgencias no esperan.",
    photo: "FOTO REAL: retrato cercano del Dr. Ancona, bata, expresión cálida",
  },
];

export default function Differentiators() {
  return (
    <section className="bg-primary-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <p className="text-center font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent md:text-left">
            Por qué conmigo
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {CARDS.map(({ Icon, title, text, photo, link }, i) => (
            <Reveal key={title} delay={i * 80} className="flex">
              <div className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-background transition duration-200 ease-out md:hover:-translate-y-[3px] md:hover:shadow-lg">
                <PhotoPlaceholder
                  label={photo}
                  flush
                  className="aspect-[4/3] w-full"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <Icon
                      className="h-5 w-5 shrink-0 text-primary"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-heading text-lg font-bold text-primary">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-3 flex-1 font-body text-ink/75">{text}</p>
                  {link && (
                    <Link
                      href={link.href}
                      className="group/arrow mt-5 inline-flex items-center gap-1 font-body text-sm font-semibold text-accent hover:opacity-80"
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-150 group-hover/arrow:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
