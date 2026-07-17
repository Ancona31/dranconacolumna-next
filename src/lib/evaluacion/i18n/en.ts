/**
 * Copy transversal del motor en INGLÉS.
 *
 * TODO F3.E — traducción pendiente. Estrategia de F3.A (consistente con el
 * contenido de los tests): el pack EN reutiliza el ES completo para que
 * /en/assessment funcione de inmediato con texto en español. En F3.E se
 * reemplaza este spread por un objeto EngineCopy con los literales traducidos
 * campo por campo.
 *
 * Excepción F3.B: el conector de mirrors (exampleLead/exampleJoin) ya se
 * traduce aquí porque F3.B lo necesita para que los mirrors de los 3 tests de
 * columna se lean en inglés en /en/assessment.
 */

import type { EngineCopy } from "./types";
import { es } from "./es";

export const en: EngineCopy = {
  ...es,
  exampleLead: " — for example, ",
  exampleJoin: " and ",
};
