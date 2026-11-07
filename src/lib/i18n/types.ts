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
    /**
     * Crédito del modelo anatómico 3D (licencia CC BY-SA 2.1 JP). Se arma
     * como: `{modelCreditLead} [modelCreditSource] {modelCreditModified},
     * {modelCreditLicenseLead} [CC BY-SA 2.1 JP]`, con fuente y licencia
     * enlazadas (la licencia exige enlazar su texto e indicar cambios).
     */
    modelCreditLead: string;
    modelCreditSource: string;
    modelCreditModified: string;
    modelCreditLicenseLead: string;
    /** Aviso para lectores de pantalla en enlaces que abren pestaña nueva. */
    opensInNewTab: string;
    /** Título de la columna de navegación (también aria-label del <nav>). */
    navHeading: string;
    /** Título de la columna de contacto y sedes. */
    contactHeading: string;
    /** Enlace a la página de contacto, al pie del resumen de sedes. */
    locationsLinkLabel: string;
    contactHref: string;
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
