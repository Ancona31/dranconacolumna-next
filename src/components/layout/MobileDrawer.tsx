"use client";

import { useRef, type RefObject } from "react";
import { Dialog } from "@base-ui/react/dialog";
import Link from "next/link";
import { openWhatsAppInApp } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import type { UiStrings } from "@/lib/i18n/types";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buttonClasses } from "@/components/ui/Button";
import { useNextFrame } from "@/components/ui/useNextFrame";

/**
 * Panel del menú móvil: Dialog modal de Base UI. Se carga bajo demanda desde
 * el Header (next/dynamic) al primer gesto sobre la hamburguesa, para que la
 * librería no pese en la carga inicial de cada página.
 *
 * La librería se encarga del montaje y la salida animada (data-starting-style
 * / data-ending-style), la trampa de foco, Escape, el toque en el fondo, el
 * bloqueo de scroll (también en iOS), de ocultar el resto de la página a los
 * lectores de pantalla y de devolver el foco a la hamburguesa al cerrar. El
 * estado abierto/cerrado, el cierre por cambio de ruta y por Atrás viven en
 * el Header.
 */
export default function MobileDrawer({
  open,
  onOpenChange,
  instantClose,
  onCloseComplete,
  openedByKeyboard,
  toggleRef,
  strings,
  whatsappLink,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Cierre sin transición (cambio de ruta con el drawer abierto). */
  instantClose: boolean;
  onCloseComplete: () => void;
  openedByKeyboard: boolean;
  toggleRef: RefObject<HTMLButtonElement | null>;
  strings: UiStrings;
  whatsappLink: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const ready = useNextFrame();
  const close = () => onOpenChange(false);

  // Misma curva de iOS en ambos sentidos: entra en 300ms y sale en 200ms.
  // Con reducir movimiento el panel no se desliza: se funde en 150ms
  // (.drawer-panel + .rm-fade en globals.css).
  const motion = instantClose
    ? "transition-none"
    : "ease-drawer duration-300 data-[ending-style]:duration-200";

  return (
    <Dialog.Root
      open={open && ready}
      onOpenChange={(next) => onOpenChange(next)}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) onCloseComplete();
      }}
    >
      {/* Bajo el header (z-[60]), que queda siempre visible y con la
          hamburguesa (ahora X) a mano para cerrar con puntero. */}
      <Dialog.Portal>
        <Dialog.Backdrop
          className={`rm-fade fixed inset-0 z-50 bg-ink/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 lg:hidden ${motion}`}
        />
        <Dialog.Popup
          ref={panelRef}
          aria-label={strings.header.menuLabel}
          // Con teclado el foco va al primer enlace (con su anillo); al tocar
          // o con ratón va al panel mismo, que no dibuja anillo (en iPhone el
          // foco programático tras un toque pintaba el anillo en el enlace).
          initialFocus={() => (openedByKeyboard ? true : panelRef.current)}
          finalFocus={toggleRef}
          className={`drawer-panel rm-fade fixed right-0 top-0 z-50 flex h-full w-72 max-w-[80%] flex-col overflow-y-auto overscroll-contain bg-background pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pt-[4.5rem] shadow-overlay outline-none transition-transform data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full lg:hidden ${motion}`}
        >
          <nav className="flex flex-col p-4">
            {strings.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="border-b border-ink/5 py-3 font-body text-base font-medium text-ink transition-colors duration-150 ease-out hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                trackEvent("whatsapp_click", { source_section: "header" });
                if (openWhatsAppInApp(whatsappLink)) e.preventDefault();
                close();
              }}
              className={buttonClasses({ variant: "whatsapp", className: "mt-4" })}
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp" />
              {strings.header.whatsappLabel}
            </a>
            {/* Cierre dentro del panel para teclado y lectores de pantalla:
                mientras el diálogo es modal, VoiceOver no alcanza la
                hamburguesa del header. Invisible hasta recibir foco de
                teclado. */}
            <Dialog.Close className="sr-only min-h-11 rounded-full font-body text-sm font-medium text-muted focus-visible:not-sr-only focus-visible:mt-3 focus-visible:inline-flex focus-visible:items-center focus-visible:justify-center">
              {strings.header.closeMenu}
            </Dialog.Close>
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
