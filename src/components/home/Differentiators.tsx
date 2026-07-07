import ButtonLink from "@/components/ui/Button";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { IconScalpel, IconCube } from "@/components/ui/Icons";

const CARDS = [
  {
    Icon: IconScalpel,
    title: "Cirugía de mínima invasión",
    text: "Incisiones milimétricas que respetan tu músculo. Menos dolor después de operarte y una recuperación más rápida: muchos pacientes caminan el mismo día.",
    photo: "FOTO REAL: el Dr. Ancona en quirófano con microscopio quirúrgico",
    href: "/minima-invasion",
  },
  {
    Icon: IconCube,
    title: "Planeación quirúrgica 3D",
    text: "Antes de operarte, imprimo un modelo real de tu columna a partir de tus estudios. Así planeo cada paso — y tú entiendes exactamente qué haremos.",
    photo: "FOTO REAL: modelo 3D impreso de columna en manos del doctor",
    href: "/tecnologia-3d",
  },
];

export default function Differentiators() {
  return (
    <section className="bg-primary-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <p className="text-center font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent md:text-left">
          Por qué conmigo
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {CARDS.map(({ Icon, title, text, photo, href }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-primary/10 bg-background p-6"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-heading text-2xl font-bold text-primary">
                {title}
              </h3>
              <p className="mt-3 font-body text-ink/75">{text}</p>
              <PhotoPlaceholder label={photo} className="mt-5 aspect-[4/3]" />
              <div className="mt-5">
                <ButtonLink href={href} variant="outline">
                  Conocer más
                  <span aria-hidden="true">→</span>
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
