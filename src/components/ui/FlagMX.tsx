/**
 * Bandera de México simplificada para tamaños pequeños (~20×14 px): tres
 * franjas verticales iguales, sin escudo (ilegible a este tamaño). Dibujada a
 * mano según spec; no se copia de flag-icons porque su archivo trae el escudo.
 * Colores oficiales: verde #006847, blanco, rojo #CE1126.
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
    </svg>
  );
}
