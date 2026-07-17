/**
 * Emisión segura de eventos a GA4. `trackEvent` es no-op si gtag no cargó
 * (dev, producción sin GA, o antes de que el script esté listo), así que se
 * puede llamar desde cualquier punto de clic sin condicionales.
 */

/** Nivel funcional del reporte, con "urgente" cuando la alerta escala. */
type Nivel = "leve" | "moderada" | "severa" | "urgente";
/** Nivel de alerta independiente del score. */
type Alerta = "none" | "precaucion" | "urgente";

/** Método por el que se compartió contenido (ShareButton). */
export type ShareMetodo =
  | "nativo"
  | "whatsapp"
  | "facebook"
  | "correo"
  | "copiar";

/** Ubicación desde donde se disparó un click de WhatsApp. */
export type WhatsAppOrigen =
  | "header"
  | "mobile_bar"
  | "hero"
  | "padecimiento_cta"
  | "padecimiento_barra"
  | "reporte"
  | "reporte_urgente"
  | "contacto"
  | "sede_merida"
  | "sede_uman"
  | "cirugia_cta"
  | "sobre_mi"
  | "flotante";

/** Eventos del embudo y sus parámetros. */
type EventParams = {
  evaluacion_iniciada: { zona: string };
  evaluacion_completada: { zona: string; nivel: Nivel; alerta: Alerta };
  reporte_pdf_descargado: { zona: string; nivel: Nivel };
  click_whatsapp: { origen: WhatsAppOrigen };
  contenido_compartido: { origen: string; metodo: ShareMetodo };
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Locale de la página actual, derivado del pathname. El árbol EN vive bajo
 * /en; todo lo demás es ES. Se calcula aquí en cada emisión para no tener que
 * pasar el locale por los 13 puntos de llamada de trackEvent (que están en
 * componentes tanto ES como EN).
 */
function currentLocale(): "es" | "en" {
  const path = window.location.pathname;
  return path === "/en" || path.startsWith("/en/") ? "en" : "es";
}

export function trackEvent<K extends keyof EventParams>(
  name: K,
  params: EventParams[K]
): void {
  if (typeof window === "undefined") return;
  // `locale` acompaña a todos los eventos; nombres y demás parámetros no cambian.
  window.gtag?.("event", name, { ...params, locale: currentLocale() });
}
