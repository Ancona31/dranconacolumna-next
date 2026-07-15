/**
 * Runner del harness de regresión F3 (scripts/f3-regression.ts).
 *
 * El entorno no tiene tsx ni ts-node, pero sí jiti (dependencia transitiva ya
 * instalada). jiti carga el harness TypeScript resolviendo el alias "@/" del
 * tsconfig (paths: { "@/*": ["./src/*"] }).
 *
 * Uso:
 *   node scripts/run-f3.mjs                 # imprime el JSON a stdout
 *   node scripts/run-f3.mjs <archivo.json>  # lo escribe en <archivo.json>
 *
 * Para regenerar el baseline:
 *   node scripts/run-f3.mjs scripts/f3-baseline.json
 * Para comparar contra el baseline tras un refactor:
 *   node scripts/run-f3.mjs /tmp/f3-now.json && diff scripts/f3-baseline.json /tmp/f3-now.json
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

const mod = await jiti.import(resolve(here, "f3-regression.ts"));
const json = mod.stableStringify(mod.runHarness());

const target = process.argv[2];
if (target) {
  writeFileSync(target, json + "\n");
  process.stderr.write(`wrote ${target}\n`);
} else {
  process.stdout.write(json + "\n");
}
