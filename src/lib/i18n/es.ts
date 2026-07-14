import type { UiStrings } from "./types";
import { MAIN_NAV, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/nav";
import { TAGLINE } from "@/lib/config";

/**
 * Strings de UI en español. Fuente de verdad histórica: se reutilizan las
 * constantes existentes (MAIN_NAV, WHATSAPP_DEFAULT_MESSAGE, TAGLINE) para
 * garantizar que el render en español no cambie ni un carácter.
 */
export const es: UiStrings = {
  nav: MAIN_NAV,
  tagline: TAGLINE,
  header: {
    logoAlt: "Logotipo Dr. Angel Ancona — columna vertebral",
    whatsappLabel: "WhatsApp",
    closeMenu: "Cerrar menú",
    openMenu: "Abrir menú",
    menuLabel: "Menú",
  },
  footer: {
    logoAlt: "Logotipo Dr. Angel Ancona — columna vertebral",
    cedulaProf: "Céd. Prof.",
    cedulaEsp: "Céd. Esp.",
    privacyLabel: "Aviso de privacidad",
    privacyHref: "/aviso-de-privacidad",
    disclaimer:
      "Las evaluaciones de este sitio son orientativas y no sustituyen una consulta médica.",
  },
  mobileBar: {
    evaluationCta: "Hacer mi evaluación",
    evaluationHref: "/evaluacion",
    whatsappLabel: "WhatsApp",
  },
  whatsappFloat: {
    ariaLabel: "Contactar por WhatsApp",
  },
  notFound: {
    metaTitle: "Página no encontrada",
    errorLabel: "Error 404",
    title: "Página no encontrada",
    description: "La página que buscas no existe o cambió de dirección.",
    ctaLabel: "Ver padecimientos",
    ctaHref: "/padecimientos",
    homeLabel: "Volver al inicio",
    homeHref: "/",
  },
  whatsappDefaultMessage: WHATSAPP_DEFAULT_MESSAGE,
};
