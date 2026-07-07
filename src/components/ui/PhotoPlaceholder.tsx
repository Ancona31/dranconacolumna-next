type PhotoPlaceholderProps = {
  /** Describe la foto real que irá en este espacio. */
  label: string;
  className?: string;
  /**
   * Al ir a ras dentro de una card (esquinas y recorte heredados del
   * contenedor): omite el redondeo y el borde punteado propios.
   */
  flush?: boolean;
};

/**
 * Marcador visual para fotos aún no disponibles.
 * Fondo primary-soft, borde punteado sutil, texto centrado pequeño.
 */
export default function PhotoPlaceholder({
  label,
  className = "",
  flush = false,
}: PhotoPlaceholderProps) {
  const shape = flush
    ? ""
    : "rounded-2xl border-2 border-dashed border-primary/25";

  return (
    <div
      className={`flex items-center justify-center bg-primary-soft p-6 text-center ${shape} ${className}`}
    >
      <span className="font-body text-xs font-medium uppercase tracking-wide text-primary/60">
        {label}
      </span>
    </div>
  );
}
