"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { UiStrings } from "@/lib/i18n/types";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

// Sección de padecimientos con el esqueleto 3D (la marca ConditionsBodyMap).
// Mientras está en pantalla, el botón tapaba las flechas de las tarjetas en
// tablet y el escenario 3D en horizontal: ahí se oculta.
const CONDITIONS_SELECTOR = "[data-conditions-section]";

// /contacto ya trae sus propios botones de WhatsApp (uno por sede) y en
// horizontal el flotante quedaba encima del texto: ahí sobra.
const HIDDEN_ROUTES = ["/contacto", "/en/contact"];

export default function WhatsAppFloat({ strings }: { strings: UiStrings }) {
  const whatsappLink = buildWhatsAppLink(strings.whatsappDefaultMessage);
  const pathname = usePathname();
  const [overSection, setOverSection] = useState(false);

  const onHiddenRoute = HIDDEN_ROUTES.some(
    (r) => pathname === r || pathname?.startsWith(`${r}/`),
  );

  // Se vuelve a buscar la sección en cada navegación (el flotante vive en el
  // layout y no se desmonta). Un reintento corto cubre contenido que llega
  // por streaming después del primer render.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    let io: IntersectionObserver | undefined;
    const attach = () => {
      const section = document.querySelector(CONDITIONS_SELECTOR);
      if (!section) return false;
      io = new IntersectionObserver(([entry]) =>
        setOverSection(entry.isIntersecting),
      );
      io.observe(section);
      return true;
    };
    let retryId: number | undefined;
    if (!attach()) retryId = window.setTimeout(attach, 600);
    return () => {
      if (retryId !== undefined) window.clearTimeout(retryId);
      io?.disconnect();
      setOverSection(false);
    };
  }, [pathname]);

  const hidden = onHiddenRoute || overSection;

  return (
    <WhatsAppLink
      href={whatsappLink}
      section="flotante"
      ariaLabel={strings.whatsappFloat.ariaLabel}
      // Oculto: opacity + visibility (sale también del orden de Tab) y un
      // `translate` corto, que no choca con el `transform` de .wa-float
      // (subida cuando aparece la StickyCtaBar).
      // Zona segura: respeta muesca (derecha) y barra de inicio (abajo). En
      // pantallas bajas (celular/tablet en horizontal) se achica y se arrima.
      className={`wa-float fixed z-40 hidden rounded-full bottom-[max(1.5rem,calc(0.75rem+env(safe-area-inset-bottom)))] right-[max(1.5rem,calc(0.75rem+env(safe-area-inset-right)))] md:flex [@media(max-height:500px)]:bottom-[max(0.75rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:right-[max(0.75rem,env(safe-area-inset-right))] ${
        hidden ? "wa-float-hidden" : ""
      }`}
    >
      {/* El ancla se desplaza (.wa-float, cuando aparece la StickyCtaBar) y el
          círculo interior responde al hover/pulsación: transforms separados
          para que no se pisen. */}
      <span className="flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-overlay transition-transform duration-150 ease-out hover:scale-105 active:scale-[0.97] [@media(max-height:500px)]:size-11">
        <WhatsAppIcon className="size-7 [@media(max-height:500px)]:size-6" />
      </span>
    </WhatsAppLink>
  );
}
