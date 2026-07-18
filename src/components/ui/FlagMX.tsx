/**
 * Bandera de México simplificada para tamaños pequeños (~20×14 px): tres
 * franjas verticales iguales, con un pequeño círculo oscuro centrado en la
 * franja blanca que evoca el escudo (el detalle completo es ilegible a este
 * tamaño, pero el punto ya distingue la bandera de la de Italia). Dibujada a
 * mano según spec; no se copia de flag-icons porque su archivo trae el escudo
 * a todo color. Colores oficiales: verde #006847, blanco, rojo #CE1126.
 */
export default function FlagMX({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 3 2"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="1" height="2" fill="#006847" />
      <rect x="1" y="0" width="1" height="2" fill="#ffffff" />
      <rect x="2" y="0" width="1" height="2" fill="#ce1126" />
      {/* Escudo evocado: círculo centrado en la franja blanca (centro x=1.5,
          y=1). r=0.28 deja ~0.22 de margen a cada borde de la franja, así no
          la toca y queda discreto. */}
      <circle cx="1.5" cy="1" r="0.28" fill="#1a1a1a" />
    </svg>
  );
}
