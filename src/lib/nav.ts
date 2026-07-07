/** Navegación principal del sitio, compartida por Header y Footer. */

export type NavItem = {
  label: string;
  href: string;
};

export const MAIN_NAV: NavItem[] = [
  { label: "Evaluación gratuita", href: "/evaluacion" },
  { label: "Padecimientos", href: "/padecimientos" },
  { label: "Cirugía de columna", href: "/cirugia-de-columna" },
  { label: "Sobre mí", href: "/sobre-mi" },
];

/** Mensaje por defecto para el contacto por WhatsApp. */
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola Dr. Ancona, quiero agendar una valoración.";
