import type { RedFlag } from "./types";

/**
 * Alarma universal: aplica a cualquier zona, antes del test.
 * Cualquier flag positiva envía directo al estado 'urgente'.
 *
 * Solo los ids viven aquí (lógica): las etiquetas son copy por locale y se leen
 * de getEngineCopy(locale).redFlagLabels / .redFlagNoneLabel.
 */
export const RED_FLAGS: RedFlag[] = [
  { id: "fiebre" },
  { id: "perdida-peso" },
  { id: "cancer" },
  { id: "dolor-nocturno" },
];

/** Opción exclusiva de "ninguna"; su etiqueta vive en la capa de copy. */
export const RED_FLAG_NONE_ID = "ninguna";
