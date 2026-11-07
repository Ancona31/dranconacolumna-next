/**
 * Superficies del resultado del evaluador. Solo dos recetas, para que el
 * reporte se lea como un documento y no como un formulario:
 *
 *  - CARD: tarjeta blanca neutra (contenido; el color va en el ícono y la
 *    etiqueta de estado, no en el marco).
 *  - Callout: recuadro tintado con un borde tenue del mismo tono (señales,
 *    alertas, definición del nivel, recomendación). Con tono de marca, de
 *    peligro o de advertencia vía tokens; con el tono que entrega el motor
 *    (`EVAL_PALETTE`, compartido con el PDF) vía `calloutStyle`.
 */
export const CARD = "rounded-2xl border border-ink/10 bg-white shadow-card";

const CALLOUT = "rounded-2xl border";
export const CALLOUT_BRAND = `${CALLOUT} border-primary/15 bg-primary-soft`;
export const CALLOUT_DANGER = `${CALLOUT} border-danger/20 bg-danger/[0.06]`;
export const CALLOUT_WARNING = `${CALLOUT} border-warning/20 bg-warning/[0.08]`;
export const CALLOUT_TONED = CALLOUT;

/** Fondo del motor y borde con su tono vivo al 25 %, como los de token. */
export function calloutStyle(bg: string, line: string): React.CSSProperties {
  return {
    backgroundColor: bg,
    borderColor: `color-mix(in srgb, ${line} 25%, transparent)`,
  };
}
