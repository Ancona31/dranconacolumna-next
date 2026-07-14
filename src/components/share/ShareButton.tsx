"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, MessageCircle, Globe, Mail, Link2, Check } from "lucide-react";
import { trackEvent, type ShareMetodo } from "@/lib/analytics";

type ShareButtonProps = {
  url: string;
  title: string;
  text?: string;
  /** 'inline' = outline discreto · 'card' = con algo más de presencia. */
  variant?: "inline" | "card";
  /** Se propaga a analytics como `origen` del evento de compartir. */
  origen?: string;
  /** Etiqueta visible del botón. Por defecto "Compartir". */
  label?: string;
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
  label = "Compartir",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar el popover al hacer clic fuera.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

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
    shareText + url
  )}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    title
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
        // Otros errores: silencioso, no bloqueamos la UI.
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
    "inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition duration-150 active:scale-[0.985]";
  const variantClass =
    variant === "card"
      ? "border-[1.5px] border-primary bg-primary-soft px-6 py-3 text-sm text-primary hover:bg-primary hover:text-white"
      : "border border-ink/20 px-4 py-2 text-sm text-ink/70 hover:border-primary hover:text-primary";

  const itemClass =
    "flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm text-ink/80 transition-colors hover:bg-primary-soft";

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={`${base} ${variantClass}`}
      >
        <Share2 className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {label}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Opciones para compartir"
          className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-ink/10 bg-background py-1 shadow-lg"
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
            <MessageCircle
              className="h-4 w-4 shrink-0 text-whatsapp"
              strokeWidth={1.75}
              aria-hidden="true"
            />
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
            <Globe
              className="h-4 w-4 shrink-0 text-accent"
              strokeWidth={1.75}
              aria-hidden="true"
            />
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
            Correo
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={handleCopy}
            className={itemClass}
          >
            {copied ? (
              <Check
                className="h-4 w-4 shrink-0 text-success"
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <Link2
                className="h-4 w-4 shrink-0 text-accent"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
            {copied ? "¡Copiado!" : "Copiar enlace"}
          </button>
        </div>
      )}
    </div>
  );
}
