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
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
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

/**
 * En móvil intenta abrir la app de WhatsApp con el esquema `whatsapp://`, que
 * salta el navegador (y su vista web, el problema que veíamos en navegadores
 * in-app). Si la app no toma el control en ~1.2s —típicamente porque no está
 * instalada— cae al enlace web wa.me original.
 *
 * Pensado para llamarse desde el onClick del CTA. Devuelve true si tomó el
 * control (móvil): el llamador debe hacer `e.preventDefault()` para que el
 * ancla no abra además la pestaña wa.me. En desktop/SSR devuelve false y el
 * ancla se comporta como siempre.
 */
export function openWhatsAppInApp(waMeHref: string): boolean {
  if (typeof window === "undefined" || !isMobile()) return false;
  const appHref = toWhatsAppAppLink(waMeHref);
  if (!appHref) return false;

  const fallback = window.setTimeout(() => {
    window.location.href = waMeHref;
  }, 1200);

  // Si la app abre, la pestaña se oculta: cancelamos el fallback web.
  const onHide = () => {
    if (document.visibilityState === "hidden") {
      window.clearTimeout(fallback);
      document.removeEventListener("visibilitychange", onHide);
    }
  };
  document.addEventListener("visibilitychange", onHide);

  window.location.href = appHref;
  return true;
}
