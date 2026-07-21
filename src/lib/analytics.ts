/**
 * Emisión segura de eventos a GA4. `trackEvent` es no-op si gtag no cargó
 * (dev, producción sin GA, o antes de que el script esté listo), así que se
 * puede llamar desde cualquier punto de clic sin condicionales.
 */

/** Nivel funcional del reporte, con "urgente" cuando la alerta escala. */
type Nivel = "leve" | "moderada" | "severa" | "urgente";

/** Método por el que se compartió contenido (ShareButton). */
export type ShareMetodo =
  | "nativo"
  | "whatsapp"
  | "facebook"
  | "correo"
  | "copiar";

/**
 * Sección del sitio desde donde se disparó un contacto (WhatsApp o teléfono).
 * VOCABULARIO CONGELADO: estos valores se importan a Google Ads por nombre —
 * no renombrar ni traducir sin coordinar con la cuenta de Ads.
 */
export type WhatsAppSection =
  | "hero"
  | "evaluacion"
  | "padecimientos"
  | "padecimientos_barra"
  | "cirugia"
  | "aseguradoras"
  | "ubicaciones"
  | "footer"
  | "header"
  | "flotante"
  | "barra_movil"
  | "sede_medclinik"
  | "sede_celus"
  | "sobre_mi";

/** Eventos del embudo y sus parámetros. */
type EventParams = {
  evaluacion_iniciada: { zona: string };
  evaluacion_completada: { zona: string };
  reporte_pdf_descargado: { zona: string; nivel: Nivel };
  whatsapp_click: { source_section: WhatsAppSection };
  phone_click: { source_section: WhatsAppSection; phone_number: string };
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
