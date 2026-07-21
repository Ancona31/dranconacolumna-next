"use client";

import { trackEvent, type WhatsAppSection } from "@/lib/analytics";

type PhoneLinkProps = {
  /** Enlace `tel:` completo (p. ej. "tel:+529994957916"). */
  href: string;
  section: WhatsAppSection;
  /** Número en crudo para el parámetro `phone_number` (solo dígitos). */
  phoneNumber: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

/**
 * Enlace de teléfono con emisión de evento. Mismo comportamiento que un `<a>`
 * tel: normal (la llamada se inicia igual); solo añade el track antes de
 * navegar. Frontera cliente para usar desde componentes de servidor.
 */
export default function PhoneLink({
  href,
  section,
  phoneNumber,
  children,
  className,
  ariaLabel,
}: PhoneLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        trackEvent("phone_click", {
          source_section: section,
          phone_number: phoneNumber,
        });
      }}
    >
      {children}
    </a>
  );
}
