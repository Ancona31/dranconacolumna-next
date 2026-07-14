/**
 * Envoltura de la animación de entrada de página ("page-enter" en globals.css).
 * Se usa desde el template.tsx de cada locale: al re-montarse en cada
 * navegación reinicia la animación. Bajo prefers-reduced-motion queda
 * neutralizada por el propio CSS.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}
