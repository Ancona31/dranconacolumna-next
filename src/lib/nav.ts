/** Navegación principal del sitio, compartida por Header y Footer. */

export type NavItem = {
  label: string;
  href: string;
};

export const MAIN_NAV: NavItem[] = [
  { label: "Evaluación gratuita", href: "/evaluacion" },
  { label: "Padecimientos", href: "/padecimientos" },
  { label: "Mínima invasión", href: "/minima-invasion" },
  { label: "Tecnología 3D", href: "/tecnologia-3d" },
  { label: "Sobre mí", href: "/sobre-mi" },
];

/** Mensaje por defecto para el contacto por WhatsApp. */
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola Dr. Ancona, quiero agendar una valoración.";
