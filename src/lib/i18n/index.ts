import type { Locale, UiStrings } from "./types";
import { es } from "./es";
import { en } from "./en";

const STRINGS: Record<Locale, UiStrings> = { es, en };

/** Devuelve el paquete de strings de UI del locale pedido. */
export function getUiStrings(locale: Locale): UiStrings {
  return STRINGS[locale];
}

export type { Locale, UiStrings, NavItem } from "./types";
