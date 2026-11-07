"use client";

import { useEffect, useRef, type ComponentType, type RefObject } from "react";
import { Menu } from "@base-ui/react/menu";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/types";
import { useNextFrame } from "@/components/ui/useNextFrame";
import { tabbableNextTo } from "@/components/ui/menuFocus";

export type LanguageOption = {
  code: Locale;
  label: string;
  href: string;
  Flag: ComponentType<{ className?: string }>;
};

/**
 * Desplegable del selector de idioma: Menu de Base UI. Se carga bajo demanda
 * desde LanguageSwitcher (next/dynamic) al primer gesto sobre el botón.
 *
 * La librería da el portal (fuera de los z-index del header), la posición
 * con colisión y *flip*, el origen de la escala (--transform-origin),
 * flechas / Inicio / Fin / búsqueda por tecla, Escape con foco de vuelta al
 * botón y el toque fuera que cierra sin activar lo de abajo.
 */
export default function LanguageMenu({
  open,
  onOpenChange,
  openedByKeyboard,
  anchorRef,
  options,
  current,
  flagClass,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openedByKeyboard: boolean;
  anchorRef: RefObject<HTMLButtonElement | null>;
  options: LanguageOption[];
  current: Locale;
  flagClass: string;
}) {
  const ready = useNextFrame();
  const popupRef = useRef<HTMLDivElement>(null);
  // Tab saca el foco del menú hacia el control vecino del botón: en ese
  // cierre no se devuelve el foco al botón.
  const tabbedOut = useRef(false);
  const isOpen = open && ready;

  // Abierto con teclado el foco va a la primera opción; con toque o clic se
  // queda en el panel, que no dibuja anillo. Un cuadro después de abrir, para
  // ganarle al foco inicial de la librería (que va al panel).
  useEffect(() => {
    if (isOpen) tabbedOut.current = false;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !openedByKeyboard) return;
    const id = requestAnimationFrame(() => {
      popupRef.current
        ?.querySelector<HTMLElement>('[role="menuitem"]')
        ?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, openedByKeyboard]);

  return (
    <Menu.Root open={isOpen} onOpenChange={(next) => onOpenChange(next)}>
      {/* El portal abre su propio contexto en z-[70], por encima del header
          (z-[60]) y del drawer: así el fondo invisible de la librería también
          cubre el header y un toque fuera (incluso sobre el botón o el logo)
          solo cierra el menú, sin activar lo que hay debajo. */}
      <Menu.Portal className="relative z-[70]">
        {/* Fondo transparente que sigue montado durante la salida: el clic
            que acompaña a un toque fuera (la librería cierra en el
            pointerdown) cae aquí y no activa lo que hay debajo. */}
        <Menu.Backdrop className="fixed inset-0" />
        <Menu.Positioner
          anchor={anchorRef}
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          className="outline-none"
        >
          <Menu.Popup
            ref={popupRef}
            aria-label="Idioma / Language"
            finalFocus={() => (tabbedOut.current ? false : anchorRef.current)}
            onKeyDown={(e) => {
              if (e.key !== "Tab" || !anchorRef.current) return;
              e.preventDefault();
              tabbedOut.current = true;
              onOpenChange(false);
              (
                tabbableNextTo(anchorRef.current, e.shiftKey) ??
                anchorRef.current
              ).focus();
            }}
            className="popover-in min-w-[168px] overflow-hidden rounded-xl border border-ink/10 bg-background py-1 shadow-overlay outline-none"
          >
            {options.map((o) => {
              const active = o.code === current;
              return (
                <Menu.LinkItem
                  key={o.code}
                  closeOnClick
                  render={
                    <Link
                      href={o.href}
                      hrefLang={o.code}
                      aria-current={active ? "true" : undefined}
                    />
                  }
                  className={`flex min-h-[44px] items-center gap-2.5 px-3 font-body text-sm transition-colors duration-150 ease-out ${
                    active
                      ? "bg-primary/5 font-semibold text-primary"
                      : "text-ink hover:bg-ink/5 data-[highlighted]:bg-ink/5"
                  }`}
                >
                  <o.Flag className={flagClass} />
                  <span className="flex-1">{o.label}</span>
                  {active && (
                    <Check
                      className="h-4 w-4 shrink-0 text-accent"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  )}
                </Menu.LinkItem>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
