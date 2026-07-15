import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Bone, HeartHandshake } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";
import { routeFor } from "@/lib/i18n/slug-map";

// Icono, imagen y destino ES de cada tarjeta, en el mismo orden que el
// contenido. El destino se traduce por locale con routeFor; las imágenes y sus
// textos alternativos son iguales en ambos idiomas.
const CARD_META: {
  Icon: typeof ShieldCheck;
  image: { src: string; alt: string; objectPosition?: string };
  esHref?: string;
}[] = [
  {
    Icon: ShieldCheck,
    image: {
      src: "/images/quirofano-1.jpg",
      alt: "Equipo quirúrgico durante una cirugía de columna de mínima invasión",
    },
    esHref: "/cirugia-de-columna",
  },
  {
    Icon: Bone,
    image: {
      src: "/images/quirofano-fractura.jpg",
      alt: "El Dr. Ancona durante la cirugía de una fractura",
      objectPosition: "center 42%",
    },
    esHref: "/padecimientos",
  },
  {
    Icon: HeartHandshake,
    image: {
      src: "/images/dr-ancona-hospital.jpg",
      alt: "El Dr. Angel Ancona en el hospital",
      objectPosition: "center 25%",
    },
  },
];

export default function Differentiators({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).differentiators;

  return (
    <section className="bg-primary-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <p className="text-center font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent md:text-left">
            {c.eyebrow}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {c.cards.map((card, i) => {
            const meta = CARD_META[i];
            const { Icon, image } = meta;
            const href =
              card.linkLabel && meta.esHref
                ? routeFor(meta.esHref, locale)
                : null;
            return (
              <Reveal key={card.title} delay={i * 80} className="flex">
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
                        {card.title}
                      </h3>
                    </div>
                    <p className="mt-3 flex-1 font-body text-ink/75">
                      {card.text}
                    </p>
                    {href && card.linkLabel && (
                      <Link
                        href={href}
                        className="group/arrow mt-5 inline-flex items-center gap-1 font-body text-sm font-semibold text-accent hover:opacity-80"
                      >
                        {card.linkLabel}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
