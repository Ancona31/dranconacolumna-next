import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Bone, HeartHandshake } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";
import { routeFor } from "@/lib/i18n/slug-map";

// Icono, imagen y destino ES de cada tarjeta, en el mismo orden que el
// contenido. El destino se traduce por locale con routeFor; el alt de cada
// imagen se localiza (differentiators.imageAlts[i]) y por eso no vive aquí.
const CARD_META: {
  Icon: typeof ShieldCheck;
  image: { src: string; objectPosition?: string };
  esHref?: string;
}[] = [
  {
    Icon: ShieldCheck,
    image: { src: "/images/quirofano-1.jpg" },
    esHref: "/cirugia-de-columna",
  },
  {
    Icon: Bone,
    image: {
      src: "/images/quirofano-fractura.jpg",
      objectPosition: "center 42%",
    },
    esHref: "/padecimientos",
  },
  {
    Icon: HeartHandshake,
    image: {
      src: "/images/dr-ancona-hospital.jpg",
      objectPosition: "center 25%",
    },
  },
];

export default function Differentiators({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).differentiators;

  return (
    <section className="bg-primary-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <p className="text-center font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent md:text-left">
          {c.eyebrow}
        </p>

        {/* Tablet: tarjetas horizontales (foto a la izquierda) una por fila; a
            768px tres columnas dejaban el texto en ~200px de ancho. */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {c.cards.map((card, i) => {
            const meta = CARD_META[i];
            const { Icon, image } = meta;
            const href =
              card.linkLabel && meta.esHref
                ? routeFor(meta.esHref, locale)
                : null;
            return (
              <Reveal key={card.title} className="flex min-w-0">
                {/* Sin elevación en hover: la tarjeta no es un enlace (solo su
                    "Ver más" lo es) y no debe prometer un clic que no existe. */}
                {/* min-w-0 y break-words: con zoom de texto al 200 % una palabra
                    larga ("especialidad") parte en vez de desbordar. */}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-background md:flex-row lg:flex-col">
                  {/* Fondo de respaldo: si la foto falla no queda un hueco. */}
                  <div className="relative bg-primary-soft aspect-[4/3] w-full md:aspect-auto md:min-h-64 md:w-2/5 md:shrink-0 lg:aspect-[4/3] lg:min-h-0 lg:w-full">
                    <Image
                      src={image.src}
                      alt={c.imageAlts[i]}
                      fill
                      className="object-cover"
                      style={
                        image.objectPosition
                          ? { objectPosition: image.objectPosition }
                          : undefined
                      }
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 40vw, 33vw"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-6">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="h-5 w-5 shrink-0 text-primary"
                        strokeWidth={1.5}
                      />
                      <h3 className="min-w-0 font-heading text-lg font-bold break-words text-primary">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mt-3 flex-1 font-body break-words text-ink/75">
                      {card.text}
                    </p>
                    {href && card.linkLabel && (
                      <Link
                        href={href}
                        className="group/arrow mt-5 inline-flex min-h-11 items-center gap-1 self-start font-body text-sm font-semibold text-accent hover:opacity-80"
                      >
                        {card.linkLabel}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-150 ease-out group-hover/arrow:translate-x-0.5"
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
