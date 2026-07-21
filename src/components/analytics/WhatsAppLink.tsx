"use client";

import { trackEvent, type WhatsAppSection } from "@/lib/analytics";
import { openWhatsAppInApp } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  href: string;
  section: WhatsAppSection;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

/**
 * Enlace de WhatsApp con emisión de evento. Mismo comportamiento que un <a>
 * externo (nueva pestaña, rel seguro); solo añade el track antes de navegar.
 * Frontera cliente para usar desde componentes de servidor.
 */
export default function WhatsAppLink({
  href,
  section,
  children,
  className,
  ariaLabel,
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        trackEvent("whatsapp_click", { source_section: section });
        if (openWhatsAppInApp(href)) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
