/**
 * Iconos de línea fina, consistentes entre sí (stroke 1.5, viewBox 24).
 * Toman className para tamaño/color; heredan currentColor.
 */

type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Señalar zona / objetivo */
export function IconTarget({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Evaluación clínica / cuestionario */
export function IconClipboard({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M9 4.5h6a1 1 0 0 1 1 1V6a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-.5a1 1 0 0 1 1-1Z" />
      <path d="M8 5.5H6.5A1.5 1.5 0 0 0 5 7v11.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 17.5 5.5H16" />
      <path d="m8.5 12 1.5 1.5L13 10.5" />
      <path d="M14.5 16.5H16" />
      <path d="M8 16.5h3" />
    </svg>
  );
}

/** Reporte / documento explicado */
export function IconReport({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V7a1 1 0 0 0 1 1h3" />
      <path d="M9 13h6" />
      <path d="M9 16.5h6" />
      <path d="M9 9.5h2" />
    </svg>
  );
}

/** Bisturí / precisión quirúrgica */
export function IconScalpel({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 20c2.5-.3 4.5-1.3 6-3l3-3" />
      <path d="M20.2 4.8a1.6 1.6 0 0 0-2.3 0l-6.4 6.4 2.3 2.3 6.4-6.4a1.6 1.6 0 0 0 0-2.3Z" />
      <path d="m11.5 11.2-2.3-2.3-4 4a1.6 1.6 0 0 0 0 2.3l0 0a1.6 1.6 0 0 0 2.3 0Z" />
    </svg>
  );
}

/** Modelo 3D / planeación */
export function IconCube({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6Z" />
      <path d="M4 7.6 12 12l8-4.4" />
      <path d="M12 12v8.8" />
    </svg>
  );
}

/** Estrella (para calificaciones, usar con color dorado) */
export function IconStar({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3.5l2.6 5.3 5.9.86-4.25 4.14 1 5.87L12 17.9l-5.25 2.77 1-5.87L3.5 9.66l5.9-.86Z" />
    </svg>
  );
}
