/**
 * Configuración central del sitio.
 * Fuente única de verdad para datos de contacto y credenciales legales.
 */

export const SITE_NAME =
  "Dr. Angel Ancona · Ortopedia, Traumatología y Cirugía de Columna";

/** Dominio canónico, sin slash final. Fuente única para sitemap y robots. */
export const SITE_URL = "https://www.dranconacolumna.com";

/** Measurement ID de Google Analytics 4. Vacío = analítica desactivada. */
export const GA_MEASUREMENT_ID = "G-T5VGBCGJC6";

/**
 * Bajada del logotipo (header), en dos renglones. Antes era una sola línea
 * ("ORTOPEDIA · TRAUMATOLOGÍA · COLUMNA") que se truncaba en el header. Único
 * consumidor: el paquete de strings ES (@/lib/i18n/es). No se usa en metadata,
 * JSON-LD, OG ni PDF, así que no hace falta conservar la versión de una línea.
 */
export const TAGLINE_LINES = {
  line1: "ORTOPEDIA · TRAUMATOLOGÍA",
  line2: "CIRUGÍA DE COLUMNA VERTEBRAL",
};

export const DOCTOR_FULL_NAME = "Dr. Angel M. Ancona Pérez";

// CONFIRMAR con el dueño antes de producción.
export const WHATSAPP_PHONE = "529996364504";

export const CONTACT_EMAIL = "drangelmanconaperez@gmail.com";

// Cédula de médico cirujano.
export const CEDULA_PROFESIONAL = "9552456";

// Cédula de especialista en ortopedia y traumatología.
export const CEDULA_ESPECIALIDAD = "12085805";

export const CERTIFICACION =
  "Certificado por el Consejo Mexicano de Ortopedia y Traumatología, A.C.";
