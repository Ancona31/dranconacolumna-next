import type { RedFlag } from "./types";

/**
 * Alarma universal: aplica a cualquier zona, antes del test.
 * Cualquier flag positiva envía directo al estado 'urgente'.
 */
export const RED_FLAGS: RedFlag[] = [
  { id: "fiebre", label: "Fiebre junto con el dolor" },
  { id: "perdida-peso", label: "Pérdida de peso sin explicación" },
  { id: "cancer", label: "Antecedente de cáncer" },
  {
    id: "dolor-nocturno",
    label: "El dolor me despierta por la noche y no cede con el reposo",
  },
];

/** Opción exclusiva "Ninguna de las anteriores". */
export const RED_FLAG_NONE_ID = "ninguna";
export const RED_FLAG_NONE_LABEL = "Ninguna de las anteriores";
