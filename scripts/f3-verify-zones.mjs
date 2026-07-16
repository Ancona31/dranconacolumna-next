/**
 * Verifica que el ensamblado (definición + contenido ES) de cada zona indicada
 * reproduce byte a byte el TestDefinition del baseline estructural.
 *
 * Uso: node scripts/f3-verify-zones.mjs cadera codo hombro ...
 *      (sin args: intenta las 9)
 */
import { createJiti } from "jiti";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const jiti = createJiti(import.meta.url, { alias: { "@": resolve(root, "src") } });
const { assembleTest } = await jiti.import("@/lib/evaluacion/tests/assemble");
const baseline = JSON.parse(readFileSync(resolve(here, "f3-tests-baseline.json")));

// Copia local (no importar f3-regression: arrastra tests/index, que aún no está completo).
function stableStringify(value) {
  const sort = (v, anc) => {
    if (v === null || typeof v !== "object") return v;
    if (anc.has(v)) return undefined;
    const next = new Set(anc);
    next.add(v);
    if (Array.isArray(v)) return v.map((x) => sort(x, next));
    return Object.keys(v).sort().reduce((a, k) => { a[k] = sort(v[k], next); return a; }, {});
  };
  return JSON.stringify(sort(value, new Set()), null, 2);
}

// zona → [camel del export]
const camel = {
  cadera: "cadera", codo: "codo", cuello: "cuello",
  "espalda-alta": "espaldaAlta", "espalda-baja": "espaldaBaja",
  hombro: "hombro", muneca: "muneca", rodilla: "rodilla", tobillo: "tobillo",
};

const zones = process.argv.slice(2);
const list = zones.length ? zones : Object.keys(camel);
let allOk = true;
for (const z of list) {
  const c = camel[z];
  try {
    const def = await jiti.import(`@/lib/evaluacion/tests/definitions/${z}`);
    const con = await jiti.import(`@/lib/evaluacion/tests/content/es/${z}`);
    const structure = def[`${c}Structure`];
    const content = con[`${c}ContentEs`];
    const assembled = stableStringify(assembleTest(structure, content));
    const expected = stableStringify(baseline[z]);
    if (assembled === expected) {
      console.log(`${z}: IDENTICAL ✓`);
    } else {
      allOk = false;
      const al = assembled.split("\n"), bl = expected.split("\n");
      for (let i = 0; i < Math.max(al.length, bl.length); i++) {
        if (al[i] !== bl[i]) {
          console.log(`${z}: MISMATCH ✗ at line ${i}`);
          console.log(`  baseline : ${bl[i]}`);
          console.log(`  assembled: ${al[i]}`);
          break;
        }
      }
    }
  } catch (e) {
    allOk = false;
    console.log(`${z}: ERROR — ${e.message}`);
  }
}
process.exit(allOk ? 0 : 1);
