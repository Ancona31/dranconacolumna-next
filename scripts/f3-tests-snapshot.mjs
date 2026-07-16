/**
 * Snapshot ESTRUCTURAL de los 9 TestDefinition (todos los campos: labels de
 * opciones, anchors, labels de triaje, domains, reportTexts, citas…). Es un
 * contrato más fuerte que el harness de comportamiento para el PASO 2: garantiza
 * que el ensamblado definición+contenido reproduce el TestDefinition original
 * byte a byte, incluidos los textos que el harness no serializa (p. ej. los
 * labels de las opciones, que solo se ven en la UI).
 *
 * Uso:
 *   node scripts/f3-tests-snapshot.mjs                 # a stdout
 *   node scripts/f3-tests-snapshot.mjs <archivo.json>  # a archivo
 *
 * Funciona con el index legacy (TESTS) y con el nuevo (getTest(zone,'es')).
 */

import { createJiti } from "jiti";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const jiti = createJiti(import.meta.url, {
  alias: { "@": resolve(root, "src") },
});

const idx = await jiti.import("@/lib/evaluacion/tests/index");
const { stableStringify } = await jiti.import(resolve(here, "f3-regression.ts"));

const zones = [...idx.AVAILABLE_ZONES].sort();
const get =
  typeof idx.getTest === "function"
    ? (z) => idx.getTest(z, "es")
    : (z) => idx.TESTS[z];

const out = {};
for (const z of zones) out[z] = get(z);

const json = stableStringify(out);
const target = process.argv[2];
if (target) {
  writeFileSync(target, json + "\n");
  process.stderr.write(`wrote ${target}\n`);
} else {
  process.stdout.write(json + "\n");
}
