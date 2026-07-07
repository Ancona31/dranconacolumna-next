import Link from "next/link";

type Variant = "primary" | "outline" | "whatsapp";
type Size = "md" | "lg";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
};

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:opacity-90",
  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
  whatsapp: "bg-whatsapp text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-4 text-base",
};

/** Botón-enlace reutilizable. Usa Link interno o <a> externo. */
export default function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
}: ButtonLinkProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`;

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
