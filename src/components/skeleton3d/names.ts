import type { MeshRef } from "./types";

/**
 * Resolución de nombres de piezas. Cada pieza se conoce por su nombre
 * original de Blender (`userData.name`) y por el saneado de GLTFLoader
 * (espacios → "_"). Los .glb definitivos ya traen los nombres de contrato
 * (§8.1: "v_L4", "d_L4L5", "n_sciatic_R"…), así que un escenario los usa tal
 * cual o con una expresión regular (/^d_L\d/).
 */

/** ¿Alguno de los nombres de la pieza coincide con la referencia? */
export function matchesRef(names: readonly string[], ref: MeshRef): boolean {
  if (typeof ref === "string") return names.includes(ref);
  // lastIndex: una RegExp con /g o /y guarda estado entre llamadas.
  ref.lastIndex = 0;
  return names.some((n) => {
    ref.lastIndex = 0;
    return ref.test(n);
  });
}

/** Filtra las piezas que coinciden con una o varias referencias. */
export function resolveParts<T extends { names: readonly string[] }>(
  items: readonly T[],
  ref: MeshRef | readonly MeshRef[],
): T[] {
  const refs = Array.isArray(ref) ? ref : [ref as MeshRef];
  return items.filter((it) => refs.some((r) => matchesRef(it.names, r)));
}

/** Clave estable de una referencia (para cachés). */
export function refKey(ref: MeshRef): string {
  return typeof ref === "string" ? `s:${ref}` : `r:${ref.source}/${ref.flags}`;
}
