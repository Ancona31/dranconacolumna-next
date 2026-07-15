/**
 * Copy transversal del motor en INGLÉS.
 *
 * TODO F3.E — traducción pendiente. Estrategia de F3.A (consistente con el
 * contenido de los tests): el pack EN reutiliza el ES completo para que
 * /en/assessment funcione de inmediato con texto en español. En F3.E se
 * reemplaza este spread por un objeto EngineCopy con los literales traducidos
 * campo por campo.
 */

import type { EngineCopy } from "./types";
import { es } from "./es";

export const en: EngineCopy = { ...es };
