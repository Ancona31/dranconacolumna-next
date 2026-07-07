/**
 * template.tsx se re-monta en cada navegación (a diferencia de layout.tsx),
 * lo que reinicia la animación CSS "page-enter" de globals.css en cada cambio
 * de página. Bajo prefers-reduced-motion la animación queda neutralizada.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
