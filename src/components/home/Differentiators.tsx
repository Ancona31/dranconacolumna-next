import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Bone, HeartHandshake } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

type Card = {
  Icon: typeof ShieldCheck;
  title: string;
  text: string;
  image: { src: string; alt: string; objectPosition?: string };
  link?: { label: string; href: string };
};

const CARDS: Card[] = [
  {
    Icon: ShieldCheck,
    title: "Alta especialidad en cirugía de columna",
    text: "No todos los ortopedistas operan columna. Cursé una alta especialidad dedicada exclusivamente a ella, y cuando el caso lo permite uso técnicas de mínima invasión: incisiones más pequeñas, menos dolor y una recuperación más rápida.",
    image: {
      src: "/images/quirofano-1.jpg",
      alt: "Equipo quirúrgico durante una cirugía de columna de mínima invasión",
    },
    link: { label: "Conocer más", href: "/cirugia-de-columna" },
  },
  {
    Icon: Bone,
    title: "Ortopedia y traumatología integral",
    text: "Fracturas, esguinces, lesiones deportivas y desgaste articular: hombro, cadera, rodilla, mano y tobillo. La misma rigurosidad para un esguince que para una cirugía compleja.",
    image: {
      src: "/images/quirofano-fractura.jpg",
      alt: "El Dr. Ancona durante la cirugía de una fractura",
      objectPosition: "center 42%",
    },
    link: { label: "Ver padecimientos", href: "/padecimientos" },
  },
  {
    Icon: HeartHandshake,
    title: "Atención personal, de inicio a fin",
    text: "Te atiendo yo en la valoración, en el quirófano y en cada revisión — no un equipo rotativo. Mi WhatsApp responde, porque las urgencias no esperan.",
    image: {
      src: "/images/dr-ancona-hospital.jpg",
      alt: "El Dr. Angel Ancona en el hospital",
      objectPosition: "center 25%",
    },
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
          {CARDS.map(({ Icon, title, text, image, link }, i) => (
            <Reveal key={title} delay={i * 80} className="flex">
              <div className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-background transition duration-200 ease-out md:hover:-translate-y-[3px] md:hover:shadow-lg">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    style={
                      image.objectPosition
                        ? { objectPosition: image.objectPosition }
                        : undefined
                    }
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
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
