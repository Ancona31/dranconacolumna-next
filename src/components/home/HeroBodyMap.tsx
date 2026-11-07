import HeroSkeletonArt from "@/components/home/HeroSkeletonArt";
import ButtonLink from "@/components/ui/Button";
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
    waMessage(locale, WHATSAPP_DEFAULT_MESSAGE),
  );
  const evaluacionHref = routeFor("/evaluacion", locale);

  return (
    <section className="bg-primary-soft">
      {/* Zona segura en horizontal (muesca): alineado con el header. */}
      <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] md:grid-cols-2 md:py-20">
        {/* Texto. Entra con animación solo CSS (load-enter): es lo primero que
            se ve y no debe esperar a que React hidrate para hacerse visible. */}
        <div className="load-enter order-1 text-center md:text-left">
          <h1 className="font-heading text-[clamp(2.25rem,1.6rem+2.6vw,3rem)] font-extrabold leading-tight text-primary">
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

          <p className="mx-auto mt-5 max-w-md font-body text-sm text-muted md:mx-0">
            {c.note}
          </p>
          <WhatsAppLink
            href={whatsappLink}
            section="hero"
            className="mt-1 inline-flex min-h-11 items-center font-body text-sm text-accent underline underline-offset-4 hover:opacity-80"
          >
            {c.whatsappLink}
          </WhatsAppLink>
        </div>

        {/* Diapositivas de rayos X (sin marco, bordes desvanecidos). Sigue
            siendo el enlace a la evaluación, con la misma etiqueta. */}
        <div
          className="load-enter order-2 flex justify-center"
          style={{ "--load-delay": "120ms" } as React.CSSProperties}
        >
          <HeroSkeletonArt
            href={evaluacionHref}
            ariaLabel={c.figureAria}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
