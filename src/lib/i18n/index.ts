import type { Locale, UiStrings } from "./types";
import { es } from "./es";
import { en } from "./en";

const STRINGS: Record<Locale, UiStrings> = { es, en };

/** Devuelve el paquete de strings de UI del locale pedido. */
export function getUiStrings(locale: Locale): UiStrings {
  return STRINGS[locale];
}

/**
 * Mensaje para los enlaces de WhatsApp según locale. En español se usa el
 * mensaje contextual que ya escribía cada página (`esMessage`); en inglés se
 * usa el mensaje por defecto EN definido en en.ts (regla FASE 2.A: las páginas
 * EN no traducen cada mensaje, usan el default).
 */
export function waMessage(locale: Locale, esMessage: string): string {
  return locale === "es" ? esMessage : en.whatsappDefaultMessage;
}

export type { Locale, UiStrings, NavItem } from "./types";
