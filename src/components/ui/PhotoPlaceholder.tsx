type PhotoPlaceholderProps = {
  /** Describe la foto real que irá en este espacio. */
  label: string;
  className?: string;
};

/**
 * Marcador visual para fotos aún no disponibles.
 * Fondo primary-soft, borde punteado sutil, texto centrado pequeño.
 */
export default function PhotoPlaceholder({
  label,
  className = "",
}: PhotoPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-primary/25 bg-primary-soft p-6 text-center ${className}`}
    >
      <span className="font-body text-xs font-medium uppercase tracking-wide text-primary/60">
        {label}
      </span>
    </div>
  );
}
