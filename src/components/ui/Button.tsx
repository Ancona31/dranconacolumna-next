import Link from "next/link";

/**
 * Sistema de botones del sitio: una sola receta para todos los CTA.
 *
 * Variantes:
 *  - primary: azul de marca sobre fondos claros.
 *  - outline: borde azul; se rellena al pasar el puntero.
 *  - whatsapp: igual que primary (el sitio tiene un único color dominante);
 *    el ícono va en `text-whatsapp` como hijo, y eso lo identifica.
 *  - subtle: secundario discreto sobre claro (borde tenue, fondo suave al
 *    pasar el puntero). Para WhatsApp el ícono va en `text-whatsapp-strong`.
 *  - ghost: terciario neutro (borde y texto grises que toman el azul al
 *    pasar el puntero), p. ej. "Compartir" al pie de un artículo.
 *  - onDark: relleno claro sobre bandas `bg-primary` (CTA de cierre).
 *  - outlineOnDark: borde blanco translúcido sobre bandas `bg-primary`.
 *
 * Tamaños (alto mínimo, el texto puede envolver con zoom al 200 %):
 *  - sm: 36 px, header de escritorio.
 *  - md: 44 px, CTA secundarios, tarjetas y barras.
 *  - lg: 56 px, CTA principales de cada página.
 *
 * Presión y transición iguales en todas: scale 0.97 y 150 ms con --ease-out,
 * solo en transform, colores y opacidad.
 */
export type ButtonVariant =
  | "primary"
  | "outline"
  | "whatsapp"
  | "subtle"
  | "ghost"
  | "onDark"
  | "outlineOnDark";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full text-center font-body font-semibold transition-[transform,background-color,border-color,color,opacity] duration-150 ease-out active:scale-[0.97] disabled:active:scale-100";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:opacity-90",
  outline:
    "border border-primary bg-transparent text-primary hover:bg-primary hover:text-white",
  whatsapp: "bg-primary text-white hover:opacity-90",
  subtle: "border border-primary/25 text-primary hover:bg-primary-soft",
  ghost:
    "border border-ink/20 text-ink/70 hover:border-primary hover:text-primary",
  onDark: "bg-background text-primary hover:opacity-90",
  outlineOnDark: "border border-white/40 text-white hover:bg-white/10",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-9 py-2 text-sm",
  md: "min-h-11 py-2.5 text-sm",
  lg: "min-h-14 py-4 text-base",
};

// A lo ancho el botón ya no se mide por su relleno: uno mínimo deja más
// renglón al texto en 320–375 px.
const PAD_X: Record<ButtonSize, string> = {
  sm: "px-4",
  md: "px-5",
  lg: "px-7",
};

type ButtonStyle = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa todo el ancho de su contenedor. */
  fullWidth?: boolean;
  className?: string;
};

/**
 * Clases del botón. Para los enlaces con lógica propia (WhatsAppLink,
 * PhoneLink, el WhatsApp del evaluador) y los <button>, que no pasan por
 * ButtonLink pero deben verse igual.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: ButtonStyle = {}) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${
    fullWidth ? "w-full px-4" : PAD_X[size]
  }${className ? ` ${className}` : ""}`;
}

type ButtonLinkProps = ButtonStyle & {
  href: string;
  children: React.ReactNode;
  external?: boolean;
};

/** Botón-enlace reutilizable. Usa Link interno o <a> externo. */
export default function ButtonLink({
  href,
  children,
  external = false,
  ...style
}: ButtonLinkProps) {
  const classes = buttonClasses(style);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/**
 * Ancho de los CTA en pareja de las bandas de cierre: en celular se apilan con
 * el mismo ancho (dos píldoras distintas se veían sin terminar); desde sm van
 * lado a lado a su ancho natural.
 */
export const PAIRED_CTA_WIDTH = "w-full max-w-xs sm:w-auto sm:max-w-none";
