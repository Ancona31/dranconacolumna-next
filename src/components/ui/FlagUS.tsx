/**
 * Bandera de Estados Unidos simplificada para tamaños pequeños (~20×14 px): 13
 * franjas horizontales alternadas (7 rojas #B22234, 6 blancas) y cantón azul
 * #3C3B6E, sin estrellas (ilegibles a este tamaño). Dibujada a mano según spec;
 * no se copia de flag-icons porque su archivo trae las 50 estrellas.
 */
const STRIPES = Array.from({ length: 13 }, (_, i) => (
  <rect
    key={i}
    x="0"
    y={i}
    width="20"
    height="1"
    fill={i % 2 === 0 ? "#b22234" : "#ffffff"}
  />
));

export default function FlagUS({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 13"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {STRIPES}
      {/* Cantón: cubre las 7 franjas superiores y ~2/5 del ancho. */}
      <rect x="0" y="0" width="8" height="7" fill="#3c3b6e" />
    </svg>
  );
}
