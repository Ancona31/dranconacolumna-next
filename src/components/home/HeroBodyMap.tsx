import Link from "next/link";
import BodyFigureSVG from "@/components/home/BodyFigureSVG";
import ButtonLink from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/nav";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import type { Locale } from "@/lib/i18n/types";
import { waMessage } from "@/lib/i18n";
import { routeFor } from "@/lib/i18n/slug-map";
import { getHomeContent } from "@/lib/i18n/pages/home";

export default function HeroBodyMap({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).hero;
  const whatsappLink = buildWhatsAppLink(
    waMessage(locale, WHATSAPP_DEFAULT_MESSAGE)
  );
  const evaluacionHref = routeFor("/evaluacion", locale);

  return (
    <section className="bg-primary-soft">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        {/* Texto */}
        <Reveal className="order-1 text-center md:text-left">
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-4 max-w-md font-body text-lg text-ink/80 md:mx-0">
            {c.sub}
          </p>

          <div className="mt-8">
            <ButtonLink href={evaluacionHref} size="lg">
              {c.cta}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>

          <p className="mx-auto mt-5 max-w-md font-body text-sm text-ink/60 md:mx-0">
            {c.note}
          </p>
          <WhatsAppLink
            href={whatsappLink}
            origen="hero"
            className="mt-2 inline-block font-body text-sm text-accent underline underline-offset-4 hover:opacity-80"
          >
            {c.whatsappLink}
          </WhatsAppLink>
        </Reveal>

        {/* Figura (autocontenida: puntos y halos los dibuja el SVG). Sin chip:
            en la home nadie ha elegido zona todavía. */}
        <Reveal delay={120} className="order-2 flex justify-center">
          <Link
            href={evaluacionHref}
            aria-label={c.figureAria}
            className="relative block w-[82%] max-w-[382px] md:w-full md:max-w-[491px]"
          >
            {/* El <Link> ya aporta el nombre accesible; la silueta va decorativa
                (aria-hidden) para no duplicar la etiqueta. */}
            <BodyFigureSVG
              mode="ambient"
              decorative
              className="h-auto w-full text-primary"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
