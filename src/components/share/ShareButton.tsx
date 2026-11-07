"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { usePathname } from "next/navigation";
import { Share2, Mail, Link2, Check } from "lucide-react";
import { trackEvent, type ShareMetodo } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/types";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

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

/** Margen mínimo entre el menú y el borde de la pantalla. */
const VIEWPORT_GUTTER = 8;

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
 * Respaldo para escritorio sin `navigator.share`: popover con WhatsApp,
 * Facebook, Correo y Copiar enlace. Sin librerías externas, iconos lucide
 * (cero emojis), tokens del sitio.
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
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Abierto: el foco pasa a la primera opción; toque/clic fuera cierra
  // (pointerdown cubre ratón y táctil) y Escape cierra devolviendo el foco al
  // botón.
  useEffect(() => {
    if (!open) return;
    menuRef.current
      ?.querySelector<HTMLElement>('[role="menuitem"]')
      ?.focus({ preventScroll: true });
    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Antes de pintar: si el menú alineado a la derecha del botón se saldría
  // de la pantalla (botón pegado al borde izquierdo, celular sin Web Share),
  // se desplaza lo justo para quedar dentro, con un margen de 8 px. Se toca
  // el estilo del nodo directo: el menú se desmonta al cerrar, así que cada
  // apertura arranca de la posición por defecto.
  useLayoutEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const container = containerRef.current;
    if (!menu || !container) return;
    const box = container.getBoundingClientRect();
    const width = menu.offsetWidth;
    const vw = document.documentElement.clientWidth;
    const preferred = box.right - width;
    const clamped = Math.min(
      Math.max(preferred, VIEWPORT_GUTTER),
      vw - VIEWPORT_GUTTER - width,
    );
    if (clamped === preferred) return;
    menu.style.left = `${clamped - box.left}px`;
    menu.style.right = "auto";
    menu.style.transformOrigin = "top";
  }, [open]);

  // Navegación del menú con flechas, Inicio y Fin (patrón ARIA menu). Tab
  // cierra y deja que el foco siga su curso.
  function onMenuKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "ArrowDown"
        ? (index + 1) % items.length
        : e.key === "ArrowUp"
          ? (index - 1 + items.length) % items.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? items.length - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    items[next].focus();
  }

  // El feedback "¡Copiado!" se apaga solo a los 2s.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const track = (metodo: ShareMetodo) =>
    trackEvent("contenido_compartido", { origen: origen ?? "", metodo });

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

  async function handleClick() {
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
        setOpen(true);
      }
      return;
    }
    // Respaldo escritorio: alternar el popover.
    setOpen((v) => !v);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true); // el popover se queda abierto para mostrar "¡Copiado!"
      track("copiar");
    } catch {
      // Sin permiso de portapapeles: no rompemos el flujo.
    }
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-[transform,background-color,border-color,color,opacity] duration-150 ease-out active:scale-[0.97]";
  const variantClass =
    variant === "card"
      ? "border-[1.5px] border-primary bg-primary-soft px-6 py-3 text-sm text-primary hover:bg-primary hover:text-white"
      : "border border-ink/20 px-4 py-2 text-sm text-ink/70 hover:border-primary hover:text-primary";

  const itemClass =
    "flex min-h-[44px] w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm text-ink/80 transition-colors duration-150 ease-out hover:bg-primary-soft focus-visible:bg-primary-soft";

  // Cruce de íconos al copiar: los dos ocupan la misma celda y el que entra
  // crece desde 75 % con un fundido de 150 ms (sin cambio de golpe).
  const iconSwap =
    "col-start-1 row-start-1 h-4 w-4 transition-[opacity,scale] duration-150 ease-out";

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleClick}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={buttonLabel}
        className={`${base} ${variantClass}`}
      >
        <Share2
          className="h-4 w-4 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        {buttonLabel}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={t.menuAria}
          onKeyDown={onMenuKeyDown}
          className="popover-in absolute right-0 z-20 mt-2 w-52 max-w-[calc(100vw-1rem)] origin-top-right overflow-hidden rounded-xl border border-ink/10 bg-background py-1 shadow-overlay"
        >
          <a
            role="menuitem"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("whatsapp");
              setOpen(false);
            }}
            className={itemClass}
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp" />
            WhatsApp
          </a>
          <a
            role="menuitem"
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("facebook");
              setOpen(false);
            }}
            className={itemClass}
          >
            <FacebookIcon className="h-4 w-4 shrink-0 text-[#0866ff]" />
            Facebook
          </a>
          <a
            role="menuitem"
            href={mailHref}
            onClick={() => {
              track("correo");
              setOpen(false);
            }}
            className={itemClass}
          >
            <Mail
              className="h-4 w-4 shrink-0 text-accent"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {t.email}
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={handleCopy}
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
          </button>
        </div>
      )}
    </div>
  );
}
