/**
 * Contrato de strings de UI por idioma.
 *
 * Cubre solo el "chrome" del sitio (Header, Footer, MobileActionBar,
 * WhatsAppFloat y la página 404). El contenido de cada página vive en sus
 * propios módulos; aquí solo va lo que comparten todas las rutas de un locale.
 */

export type Locale = "es" | "en";

/** Item de navegación principal (Header y Footer). */
export interface NavItem {
  label: string;
  href: string;
}

export interface UiStrings {
  /** Navegación principal: 5 items. */
  nav: NavItem[];

  /** Bajada bajo el logotipo, en dos renglones (se apilan en el header). */
  tagline: { line1: string; line2: string };

  header: {
    logoAlt: string;
    /** Etiqueta del botón/enlace de WhatsApp. */
    whatsappLabel: string;
    /** aria-label del botón hamburguesa cuando el drawer está abierto. */
    closeMenu: string;
    /** aria-label del botón hamburguesa cuando el drawer está cerrado. */
    openMenu: string;
    /** aria-label del drawer móvil. */
    menuLabel: string;
  };

  footer: {
    logoAlt: string;
    /** Etiqueta previa a la cédula profesional. */
    cedulaProf: string;
    /** Etiqueta previa a la cédula de especialidad. */
    cedulaEsp: string;
    /** Enlace al aviso de privacidad. */
    privacyLabel: string;
    privacyHref: string;
    /** Descargo médico. */
    disclaimer: string;
  };

  mobileBar: {
    /** CTA principal de la barra móvil. */
    evaluationCta: string;
    /** Destino base del CTA de evaluación. */
    evaluationHref: string;
    whatsappLabel: string;
  };

  whatsappFloat: {
    ariaLabel: string;
  };

  notFound: {
    /** <title> de la página 404. */
    metaTitle: string;
    errorLabel: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    homeLabel: string;
    homeHref: string;
  };

  /** Mensaje por defecto para los enlaces de WhatsApp. */
  whatsappDefaultMessage: string;
}
