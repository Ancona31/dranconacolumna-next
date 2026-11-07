/**
 * Descarga en paralelo de los archivos del 3D. NO importa three.js: se llama
 * desde Skeleton3D al mismo tiempo que el import() del motor, así el chunk de
 * three, el .glb y el decodificador Draco viajan juntos en vez de en cadena.
 *
 * Caché a nivel de módulo: al volver atrás a la página (navegación SPA) el
 * modelo y el decodificador ya están en memoria y no se vuelven a pedir.
 * Una descarga fallida se borra de la caché para poder reintentar.
 */

/** Ruta del decodificador Draco (copiado de three/examples/jsm/libs/draco/gltf/). */
export const DRACO_PATH = "/draco/";

export type DracoFiles = { js: string; wasm: ArrayBuffer };

export type SkeletonAssets = {
  /** Contenido del .glb. */
  model: Promise<ArrayBuffer>;
  /** Wrapper y binario WASM de Draco (null sin WebAssembly: lo carga el motor). */
  decoder: Promise<DracoFiles> | null;
};

const cache = new Map<string, Promise<unknown>>();

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  let p = cache.get(key) as Promise<T> | undefined;
  if (!p) {
    p = load();
    cache.set(key, p);
    // Sin esto, un fallo antes de que alguien espere la promesa saldría como
    // "unhandled rejection"; quien la espere igual recibe el error.
    p.catch(() => cache.delete(key));
  }
  return p;
}

async function get(url: string): Promise<Response> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res;
}

/** Empieza (o reutiliza) la descarga del modelo y del decodificador. */
export function prefetchSkeletonAssets(modelSrc: string, dracoPath = DRACO_PATH): SkeletonAssets {
  const model = cached(`glb:${modelSrc}`, () => get(modelSrc).then((r) => r.arrayBuffer()));
  const decoder =
    typeof WebAssembly === "object"
      ? cached(`draco:${dracoPath}`, async () => {
          const [js, wasm] = await Promise.all([
            get(`${dracoPath}draco_wasm_wrapper.js`).then((r) => r.text()),
            get(`${dracoPath}draco_decoder.wasm`).then((r) => r.arrayBuffer()),
          ]);
          return { js, wasm };
        })
      : null;
  return { model, decoder };
}
