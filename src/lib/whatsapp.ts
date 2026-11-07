import { WHATSAPP_PHONE } from "@/lib/config";

/**
 * Construye un enlace wa.me con el mensaje ya codificado para URL. Por defecto
 * usa el WhatsApp personal del doctor (config); las tarjetas de sede pasan el
 * número de su clínica (`sede.whatsapp`) para dirigir el CTA a esa sede.
 *
 * Devuelve SIEMPRE wa.me (enlace web universal), también en móvil: así el HTML
 * del servidor y el del cliente coinciden (sin mismatch de hidratación) y el
 * enlace sirve sin JS y para SEO. El salto a la app (whatsapp://) se resuelve
 * en el CLIC vía `openWhatsAppInApp`, no en el render.
 */
export function buildWhatsAppLink(
  message: string,
  phone: string = WHATSAPP_PHONE
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * ¿El dispositivo es móvil? Lee el user agent. SSR-safe: en el servidor
 * (`navigator` indefinido) asume desktop, de modo que el render inicial nunca
 * depende del dispositivo (ver nota de hidratación en `buildWhatsAppLink`).
 */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || isIOS();
}

/**
 * ¿iOS o iPadOS? iPadOS se anuncia como "Macintosh": se distingue por la
 * pantalla táctil (ninguna Mac la tiene).
 */
export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  );
}

/**
 * Convierte un href wa.me (`https://wa.me/<phone>?text=<enc>`) al esquema
 * directo de la app (`whatsapp://send?phone=<phone>&text=<enc>`). Devuelve
 * null si el href no es un wa.me válido.
 */
export function toWhatsAppAppLink(waMeHref: string): string | null {
  try {
    const url = new URL(waMeHref);
    if (url.hostname !== "wa.me") return null;
    const phone = url.pathname.replace(/^\/+/, "");
    const text = url.searchParams.get("text") ?? "";
    const params = new URLSearchParams();
    if (phone) params.set("phone", phone);
    if (text) params.set("text", text);
    return `whatsapp://send?${params.toString()}`;
  } catch {
    return null;
  }
}

/** Espera a que la app tome el control antes de abrir el respaldo web. */
const APP_FALLBACK_MS = 2500;

/**
 * En Android intenta abrir la app de WhatsApp con el esquema `whatsapp://`,
 * que salta el navegador (y su vista web, el problema que veíamos en
 * navegadores in-app). Si la app no toma el control en ~2.5 s —típicamente
 * porque no está instalada— abre el enlace web wa.me en OTRA pestaña: la
 * pestaña actual nunca navega fuera (antes se perdía el resultado de la
 * evaluación).
 *
 * En iOS no se usa el esquema: Safari muestra el diálogo "¿Abrir en
 * WhatsApp?" y el respaldo saltaba antes de que el usuario respondiera. wa.me
 * es un enlace universal que abre la app sin diálogo cuando viene de un toque,
 * así que ahí manda el ancla tal cual (target="_blank").
 *
 * Pensado para llamarse desde el onClick del CTA. Devuelve true si tomó el
 * control (Android): el llamador debe hacer `e.preventDefault()` para que el
 * ancla no abra además la pestaña wa.me. En iOS, desktop o SSR devuelve false
 * y el ancla se comporta como siempre.
 */
export function openWhatsAppInApp(waMeHref: string): boolean {
  if (typeof window === "undefined" || !isMobile() || isIOS()) return false;
  const appHref = toWhatsAppAppLink(waMeHref);
  if (!appHref) return false;

  const cleanup = () => {
    window.clearTimeout(fallback);
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", cleanup);
    window.removeEventListener("blur", cleanup);
  };
  // Si la app abre, la pestaña se oculta o pierde el foco (selector de apps):
  // se cancela el respaldo web.
  const onHide = () => {
    if (document.visibilityState === "hidden") cleanup();
  };

  const fallback = window.setTimeout(() => {
    cleanup();
    // Pestaña nueva, nunca location.href: el resultado sigue en esta. Sin
    // "noopener" en las features (haría que window.open devuelva null); el
    // opener se corta a mano.
    const win = window.open(waMeHref, "_blank");
    if (win) win.opener = null;
  }, APP_FALLBACK_MS);

  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", cleanup);
  window.addEventListener("blur", cleanup);

  window.location.href = appHref;
  return true;
}
