"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Menu } from "@base-ui/react/menu";
import { Mail, Link2, Check } from "lucide-react";
import type { ShareMetodo } from "@/lib/analytics";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useNextFrame } from "@/components/ui/useNextFrame";
import { tabbableNextTo } from "@/components/ui/menuFocus";

/** Logos de marca (trazos de simple-icons) a 16px, mismo tamaño que lucide. */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

export type ShareMenuStrings = {
  menuAria: string;
  email: string;
  copy: string;
  copied: string;
};

/**
 * Menú de respaldo de ShareButton (sin Web Share, o si share() falló): Menu
 * de Base UI con WhatsApp, Facebook, Correo y Copiar enlace. Se carga bajo
 * demanda (next/dynamic) al primer gesto sobre el botón.
 *
 * La librería da el portal, la posición con colisión (nunca se sale de la
 * pantalla, ni a 320 px), el origen de la escala, la navegación con teclado,
 * Escape con foco de vuelta al botón y el toque fuera que solo cierra.
 */
export default function ShareMenu({
  open,
  onOpenChange,
  openedByKeyboard,
  anchorRef,
  url,
  title,
  text,
  strings: t,
  onTrack,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openedByKeyboard: boolean;
  anchorRef: RefObject<HTMLButtonElement | null>;
  url: string;
  title: string;
  text?: string;
  strings: ShareMenuStrings;
  onTrack: (metodo: ShareMetodo) => void;
}) {
  const ready = useNextFrame();
  const popupRef = useRef<HTMLDivElement>(null);
  // Tab saca el foco del menú hacia el control vecino del botón: en ese
  // cierre no se devuelve el foco al botón.
  const tabbedOut = useRef(false);
  const isOpen = open && ready;
  const [copied, setCopied] = useState(false);

  // Abierto con teclado el foco va a la primera opción; con clic se queda en
  // el panel. Un cuadro después de abrir, para ganarle al foco inicial de la
  // librería (que va al panel).
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

  // El feedback "¡Copiado!" se apaga solo a los 2s.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const shareText = text ? `${text} ` : "";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    shareText + url,
  )}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url,
  )}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    title,
  )}&body=${encodeURIComponent(shareText + url)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true); // el menú se queda abierto para mostrar "¡Copiado!"
      onTrack("copiar");
    } catch {
      // Sin permiso de portapapeles: no rompemos el flujo.
    }
  }

  const itemClass =
    "flex min-h-[44px] w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left font-body text-sm text-ink/80 outline-none transition-colors duration-150 ease-out hover:bg-primary-soft focus-visible:bg-primary-soft data-[highlighted]:bg-primary-soft";

  // Cruce de íconos al copiar: los dos ocupan la misma celda y el que entra
  // crece desde 75 % con un fundido de 150 ms (sin cambio de golpe).
  const iconSwap =
    "col-start-1 row-start-1 h-4 w-4 transition-[opacity,scale] duration-150 ease-out";

  return (
    <Menu.Root open={isOpen} onOpenChange={(next) => onOpenChange(next)}>
      {/* Contexto propio en z-[80]: por encima del header (z-[60]) y del
          diálogo del evaluador (z-[70]), donde también vive este botón. */}
      <Menu.Portal className="relative z-[80]">
        {/* Fondo transparente que sigue montado durante la salida: el clic
            que acompaña a un toque fuera (la librería cierra en el
            pointerdown) cae aquí y no activa lo que hay debajo. */}
        <Menu.Backdrop className="fixed inset-0" />
        {/* Alineado al borde derecho del botón; si así se saldría de la
            pantalla (botón pegado a la izquierda en un teléfono de 320 px),
            la librería lo desplaza lo justo para quedar dentro, con 8 px de
            margen, y si no cabe abajo lo pasa arriba. */}
        <Menu.Positioner
          anchor={anchorRef}
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          collisionAvoidance={{ side: "flip", align: "shift" }}
          className="outline-none"
        >
          <Menu.Popup
            ref={popupRef}
            aria-label={t.menuAria}
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
            className="popover-in w-52 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-ink/10 bg-background py-1 shadow-overlay outline-none"
          >
            <Menu.LinkItem
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              closeOnClick
              onClick={() => onTrack("whatsapp")}
              className={itemClass}
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp" />
              WhatsApp
            </Menu.LinkItem>
            <Menu.LinkItem
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              closeOnClick
              onClick={() => onTrack("facebook")}
              className={itemClass}
            >
              <FacebookIcon className="h-4 w-4 shrink-0 text-[#0866ff]" />
              Facebook
            </Menu.LinkItem>
            <Menu.LinkItem
              href={mailHref}
              closeOnClick
              onClick={() => onTrack("correo")}
              className={itemClass}
            >
              <Mail
                className="h-4 w-4 shrink-0 text-accent"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {t.email}
            </Menu.LinkItem>
            <Menu.Item
              closeOnClick={false}
              onClick={handleCopy}
              label={t.copy}
              className={itemClass}
            >
              <span aria-hidden="true" className="grid shrink-0">
                <Link2
                  className={`${iconSwap} text-accent ${
                    copied ? "scale-75 opacity-0" : "scale-100 opacity-100"
                  }`}
                  strokeWidth={1.75}
                />
                <Check
                  className={`${iconSwap} text-success ${
                    copied ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
                  strokeWidth={2}
                />
              </span>
              {copied ? t.copied : t.copy}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
