import type { Locale } from "@/lib/i18n/types";
import type { EngineCopy } from "./types";
import { es } from "./es";
import { en } from "./en";

const ENGINE_COPY: Record<Locale, EngineCopy> = { es, en };

/** Devuelve la copy transversal del motor para el locale pedido. */
export function getEngineCopy(locale: Locale): EngineCopy {
  return ENGINE_COPY[locale];
}

export type { EngineCopy } from "./types";
