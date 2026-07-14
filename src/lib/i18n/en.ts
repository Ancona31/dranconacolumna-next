import type { UiStrings } from "./types";

/**
 * Strings de UI en inglés.
 *
 * NOTA (FASE 1): salvo el home /en, las páginas en inglés todavía no existen.
 * Por eso los href internos de nav/footer/mobileBar apuntan de momento al home
 * /en. TODO F2+: apuntarlos a las rutas EN reales conforme se traduzcan.
 */
export const en: UiStrings = {
  nav: [
    { label: "Free Evaluation", href: "/en" },
    { label: "Conditions", href: "/en" },
    { label: "Spine Surgery", href: "/en" },
    { label: "About Me", href: "/en" },
    { label: "Contact", href: "/en" },
  ],
  tagline: "ORTHOPEDICS · TRAUMATOLOGY · SPINE",
  header: {
    logoAlt: "Dr. Angel Ancona logo — spine",
    whatsappLabel: "WhatsApp",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    menuLabel: "Menu",
  },
  footer: {
    logoAlt: "Dr. Angel Ancona logo — spine",
    cedulaProf: "Prof. License",
    cedulaEsp: "Specialty License",
    privacyLabel: "Privacy notice",
    // TODO F2+: reemplazar por /en/privacy-notice cuando exista.
    privacyHref: "/aviso-de-privacidad",
    disclaimer:
      "The evaluations on this site are for guidance only and do not replace a medical consultation.",
  },
  mobileBar: {
    evaluationCta: "Start my evaluation",
    evaluationHref: "/en",
    whatsappLabel: "WhatsApp",
  },
  whatsappFloat: {
    ariaLabel: "Contact via WhatsApp",
  },
  notFound: {
    metaTitle: "Page not found",
    errorLabel: "Error 404",
    title: "Page not found",
    description: "The page you are looking for doesn't exist or has moved.",
    ctaLabel: "Back to home",
    ctaHref: "/en",
    homeLabel: "Back to home",
    homeHref: "/en",
  },
  whatsappDefaultMessage:
    "Hello Dr. Ancona, I found your website and I would like to schedule an appointment.",
};
