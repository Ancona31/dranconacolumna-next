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

export function trackEvent<K extends keyof EventParams>(
  name: K,
  params: EventParams[K]
): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
