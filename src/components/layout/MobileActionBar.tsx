"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Locale, UiStrings } from "@/lib/i18n/types";
import { assessmentHref } from "@/lib/i18n/slug-map";
import { getPadecimiento } from "@/lib/padecimientos";
import { getPadecimientoEn } from "@/lib/padecimientos/en";
import { trackEvent } from "@/lib/analytics";

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
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 md:hidden">
      <Link
        href={evaluacionHref}
        className="flex-1 bg-primary py-4 text-center font-body text-sm font-semibold text-white transition duration-150 active:scale-[0.985]"
      >
        {strings.mobileBar.evaluationCta}
      </Link>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("click_whatsapp", { origen: "mobile_bar" })}
        className="flex-1 bg-whatsapp py-4 text-center font-body text-sm font-semibold text-white transition duration-150 active:scale-[0.985]"
      >
        {strings.mobileBar.whatsappLabel}
      </a>
    </div>
  );
}
