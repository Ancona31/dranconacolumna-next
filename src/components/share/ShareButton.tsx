"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Share2 } from "lucide-react";
import { trackEvent, type ShareMetodo } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/types";
import { useLazyComponent } from "@/components/ui/useLazyComponent";
import { buttonClasses } from "@/components/ui/Button";

/** Textos fijos del menú por idioma (el botón trae su `label` de la página). */
const STRINGS: Record<
  Locale,
  { label: string; menuAria: string; email: string; copy: string; copied: string }
> = {
  es: {
    label: "Compartir",
    menuAria: "Opciones para compartir",
    email: "Correo",
    copy: "Copiar enlace",
    copied: "¡Copiado!",
  },
  en: {
    label: "Share",
    menuAria: "Sharing options",
    email: "Email",
    copy: "Copy link",
    copied: "Copied!",
  },
};

// El menú de respaldo (Base UI Menu) se carga bajo demanda: el botón se
// renderiza en el servidor y el menú se pide al primer gesto sobre él.
const loadMenu = () => import("@/components/share/ShareMenu");

type ShareButtonProps = {
  url: string;
  title: string;
  text?: string;
  /** 'inline' = outline discreto · 'card' = con algo más de presencia. */
  variant?: "inline" | "card";
  /** Se propaga a analytics como `origen` del evento de compartir. */
  origen?: string;
  /** Etiqueta visible del botón. Por defecto "Compartir" / "Share". */
  label?: string;
  /** Idioma del menú. Si no llega, se deduce de la ruta (/en/…). */
  locale?: Locale;
};

/**
 * Botón de compartir. Principal: Web Share API nativa (menú del dispositivo).
 * Respaldo para escritorio sin `navigator.share`, o si share() falla por algo
 * que no sea cancelar: ShareMenu (WhatsApp, Facebook, Correo y Copiar enlace).
 * Iconos lucide (cero emojis), tokens del sitio.
 */
export default function ShareButton({
  url,
  title,
  text,
  variant = "inline",
  origen,
  label,
  locale,
}: ShareButtonProps) {
  const pathname = usePathname();
  const lang: Locale =
    locale ?? (pathname === "/en" || pathname?.startsWith("/en/") ? "en" : "es");
  const t = STRINGS[lang];
  const buttonLabel = label ?? t.label;
  const [open, setOpen] = useState(false);
  // El menú se monta la primera vez que hace falta y ya no se desmonta (así
  // su salida se anima y el "¡Copiado!" no se pierde).
  const [wanted, setWanted] = useState(false);
  const [openedByKeyboard, setOpenedByKeyboard] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [ShareMenu, requestMenu] = useLazyComponent(loadMenu);

  const track = (metodo: ShareMetodo) =>
    trackEvent("contenido_compartido", { origen: origen ?? "", metodo });

  function showMenu(byKeyboard: boolean) {
    setOpenedByKeyboard(byKeyboard);
    setWanted(true);
    setOpen(true);
    requestMenu();
  }

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    // detail === 0: el clic lo generó el teclado, no un puntero.
    const byKeyboard = e.detail === 0;
    // Ruta principal: menú nativo del dispositivo si existe.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        track("nativo");
      } catch (err) {
        // AbortError = el usuario canceló: no mostramos nada.
        if (err instanceof Error && err.name === "AbortError") return;
        // Otros errores (p. ej. NotAllowedError en WebViews): se ofrece el
        // menú de respaldo en vez de no hacer nada.
        showMenu(byKeyboard);
      }
      return;
    }
    // Respaldo escritorio. Con el menú abierto el fondo de la librería recibe
    // el clic (y cierra); aquí solo llega la apertura.
    if (!open) showMenu(byKeyboard);
  }

  // Sin Web Share solo hace falta el menú: se pide al primer gesto.
  function prefetchMenu() {
    if (typeof navigator !== "undefined" && !navigator.share) requestMenu();
  }

  // Botones del sistema (ui/Button.tsx): en el reporte, contorno azul a
  // tamaño md; al pie de un artículo, terciario neutro y compacto.
  const triggerClass =
    variant === "card"
      ? buttonClasses({ variant: "outline" })
      : buttonClasses({ variant: "ghost", size: "sm" });

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleClick}
        onPointerEnter={prefetchMenu}
        onPointerDown={prefetchMenu}
        onFocus={prefetchMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={buttonLabel}
        className={triggerClass}
      >
        <Share2
          className="h-4 w-4 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        {buttonLabel}
      </button>

      {wanted && ShareMenu && (
        <ShareMenu
          open={open}
          onOpenChange={setOpen}
          openedByKeyboard={openedByKeyboard}
          anchorRef={triggerRef}
          url={url}
          title={title}
          text={text}
          strings={t}
          onTrack={track}
        />
      )}
    </div>
  );
}
