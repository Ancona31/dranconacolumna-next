import Link from "next/link";
import BodyFigureSVG from "@/components/home/BodyFigureSVG";
import ButtonLink from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/nav";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";

export default function HeroBodyMap() {
  const whatsappLink = buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE);

  return (
    <section className="bg-primary-soft">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        {/* Texto */}
        <Reveal className="order-1 text-center md:text-left">
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
            ¿Dónde te duele?
          </h1>
          <p className="mx-auto mt-4 max-w-md font-body text-lg text-ink/80 md:mx-0">
            Haz una evaluación clínica gratuita y recibe un reporte explicado en
            minutos.
          </p>

          <div className="mt-8">
            <ButtonLink href="/evaluacion" size="lg">
              Comenzar mi evaluación
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>

          <p className="mx-auto mt-5 max-w-md font-body text-sm text-ink/60 md:mx-0">
            Evaluación diseñada por el Dr. Angel Ancona — ortopedista y
            traumatólogo, especialista en cirugía de columna.
          </p>
          <WhatsAppLink
            href={whatsappLink}
            origen="hero"
            className="mt-2 inline-block font-body text-sm text-accent underline underline-offset-4 hover:opacity-80"
          >
            Prefiero agendar directamente
          </WhatsAppLink>
        </Reveal>

        {/* Figura (autocontenida: puntos y halos los dibuja el SVG). Sin chip:
            en la home nadie ha elegido zona todavía. */}
        <Reveal delay={120} className="order-2 flex justify-center">
          <Link
            href="/evaluacion"
            aria-label="Comenzar mi evaluación"
            className="relative block w-[60%] max-w-[280px] md:w-full md:max-w-[360px]"
          >
            <BodyFigureSVG mode="ambient" className="h-auto w-full text-primary" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
