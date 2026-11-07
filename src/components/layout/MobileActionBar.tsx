"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildWhatsAppLink, openWhatsAppInApp } from "@/lib/whatsapp";
import type { Locale, UiStrings } from "@/lib/i18n/types";
import { assessmentHref } from "@/lib/i18n/slug-map";
import { getPadecimiento } from "@/lib/padecimientos";
import { getPadecimientoEn } from "@/lib/padecimientos/en";
import { trackEvent } from "@/lib/analytics";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function MobileActionBar({ strings }: { strings: UiStrings }) {
  const pathname = usePathname();
  const whatsappLink = buildWhatsAppLink(strings.whatsappDefaultMessage);
  const locale: Locale = pathname?.startsWith("/en") ? "en" : "es";

  // El flujo de evaluación necesita foco total y trae su propio CTA.
  if (
    pathname?.startsWith("/evaluacion") ||
    pathname?.startsWith("/en/assessment")
  )
    return null;

  // En una página de padecimiento con zona de test, el CTA precarga la zona en
  // el evaluador; en el resto de rutas arranca desde el mapa corporal. El
  // registro de padecimientos es por idioma (ES /padecimientos · EN
  // /en/conditions); el id de zona es interno y no cambia.
  const esSlug = pathname?.match(/^\/padecimientos\/([^/]+)\/?$/)?.[1];
  const enSlug = pathname?.match(/^\/en\/conditions\/([^/]+)\/?$/)?.[1];
  const testZone =
    locale === "en"
      ? enSlug
        ? getPadecimientoEn(enSlug)?.testZone
        : undefined
      : esSlug
        ? getPadecimiento(esSlug)?.testZone
        : undefined;
  const evaluacionHref = testZone
    ? assessmentHref(locale, testZone)
    : strings.mobileBar.evaluationHref;

  return (
    // data-mobile-action-bar: globals.css reserva su alto en el body solo
    // mientras la barra existe. El padding inferior suma la zona segura del
    // iPhone para que los botones no queden bajo la barra de inicio.
    <div
      data-mobile-action-bar
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 md:hidden"
    >
      {/* min-w-0 + px-2 + leading-tight: con zoom al 200 % (~190 px de
          ancho) las etiquetas parten en dos renglones en vez de cortarse; en
          ese ancho el ícono de WhatsApp pasa arriba del texto. */}
      <Link
        href={evaluacionHref}
        className="flex min-w-0 flex-1 items-center justify-center bg-primary px-2 pb-[calc(1rem+env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pt-4 text-center font-body text-sm font-semibold leading-tight text-white transition-[filter] duration-150 ease-out active:brightness-90"
      >
        {strings.mobileBar.evaluationCta}
      </Link>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          trackEvent("whatsapp_click", { source_section: "barra_movil" });
          if (openWhatsAppInApp(whatsappLink)) e.preventDefault();
        }}
        className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 bg-background px-2 pb-[calc(1rem+env(safe-area-inset-bottom))] pr-[max(0.5rem,env(safe-area-inset-right))] pt-4 text-center font-body text-sm font-semibold leading-tight text-primary transition-[filter] duration-150 ease-out active:brightness-95 min-[260px]:flex-row min-[260px]:gap-2"
      >
        <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp-strong" />
        <span className="min-w-0 [overflow-wrap:anywhere]">
          {strings.mobileBar.whatsappLabel}
        </span>
      </a>
    </div>
  );
}
