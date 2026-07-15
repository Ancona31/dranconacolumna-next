import type { UiStrings } from "./types";

/**
 * Strings de UI en inglés.
 *
 * NOTA: las páginas EN de home, about, spine-surgery y contact ya existen; sus
 * enlaces de nav apuntan a las rutas EN reales. Evaluación y padecimientos aún
 * no tienen versión EN, así que esos dos apuntan a la ruta ES por ahora.
 */
export const en: UiStrings = {
  nav: [
    // TODO F3: /en/assessment cuando exista la evaluación en EN.
    { label: "Free Evaluation", href: "/evaluacion" },
    { label: "Conditions", href: "/en/conditions" },
    { label: "Spine Surgery", href: "/en/spine-surgery" },
    { label: "About Me", href: "/en/about" },
    { label: "Contact", href: "/en/contact" },
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
