import type { Quality } from "./types";

/** Calidad efectiva una vez resuelto "auto". */
export type ResolvedQuality = "high" | "low" | "static";

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * Elige la calidad en el cliente (plan §5/§6):
 * - Equipo modesto (≤ 4 núcleos, ≤ 4 GB de RAM) o "ahorro de datos":
 *   imágenes fijas, cero 3D.
 * - Celular o tablet (puntero táctil o < 1024 px de ancho): modelo ligero y
 *   resolución ≤ 1.5×.
 * - PC: modelo completo y resolución ≤ 2×.
 *
 * Que el navegador no tenga WebGL se detecta al crear el renderer (sin un
 * contexto de prueba aparte, que costaba una tarea larga de ~240 ms).
 */
export function resolveQuality(q: Quality): ResolvedQuality {
  if (q !== "auto") return q;
  if (typeof navigator === "undefined" || typeof matchMedia === "undefined") return "static";
  const nav = navigator as NavigatorHints;
  const cores = nav.hardwareConcurrency ?? 8;
  const saveData = nav.connection?.saveData === true;
  // Chromium expone deviceMemory: ahí aplica el criterio del plan (≤4 núcleos
  // o ≤4 GB). Safari no la expone y puede reportar pocos núcleos en iPhones
  // capaces, así que solo se considera modesto con 2 núcleos o menos.
  const modest =
    nav.deviceMemory !== undefined
      ? cores <= 4 || nav.deviceMemory <= 4
      : cores <= 2;
  if (modest || saveData) return "static";
  const desktop = matchMedia("(min-width: 1024px)").matches && !matchMedia("(pointer: coarse)").matches;
  return desktop ? "high" : "low";
}

/** El navegador expone la API de WebGL (no crea ningún contexto). */
export function webglApiAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.WebGLRenderingContext !== "undefined";
}
