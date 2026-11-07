import {
  Box3,
  BufferAttribute,
  CatmullRomCurve3,
  Matrix4,
  Mesh,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type Object3D,
} from "three";
import type { TubeDef } from "../types";
import {
  createPartMaterial,
  createPartUniforms,
  type PartKind,
  type PartUniforms,
  type SharedUniforms,
} from "./materials";

/** Una pieza animable del esqueleto (una malla del .glb o un tubo procedural). */
export type Part = {
  mesh: Mesh;
  /** Nombre original de Blender y el saneado por GLTFLoader (ver names.ts). */
  names: string[];
  kind: PartKind;
  u: PartUniforms;
  /** Matriz local de reposo. */
  rest: Matrix4;
  /** Matriz de mundo del padre y su inversa (para deformar en espacio del modelo). */
  parentWorld: Matrix4;
  parentInv: Matrix4;
  /** Caja, centro y tamaño en espacio del modelo (metros), en reposo. */
  box: Box3;
  center: Vector3;
  size: Vector3;
  /** Escala de mundo de la malla (el .glb puede venir en mm con escala 0.001). */
  worldScale: number;
  /** Tubos: longitud aproximada en metros (a lo largo de uv.x). */
  length: number;
  /**
   * Tubos que nacen de otro (extras de glTF `flow_offset`): fracción de la
   * longitud del tubo padre donde se ramifican. 0 = no es rama.
   */
  flowOffset: number;
  /** Dolor actual y destino (0..1). */
  pain: number;
  painTarget: number;
  /** Tono del tinte actual y destino: 0 = dolor, 1 = "calm". */
  tone: number;
  toneTarget: number;
  /** Deformación acumulada en este cuadro (espacio del modelo). */
  delta: Matrix4;
  deformed: boolean;
  wasDeformed: boolean;
};

const SKIN_RE = /^(piel|skin)/i;
const DISC_RE = /(disk|disc)|^d_[CTLS]\d/i;
const TUBE_RE = /^(n_|canal)|nerv/i;

function classify(names: string[]): PartKind {
  if (names.some((n) => SKIN_RE.test(n))) return "skin";
  if (names.some((n) => TUBE_RE.test(n))) return "tube";
  if (names.some((n) => DISC_RE.test(n))) return "disc";
  return "bone";
}

/** Nombres de la malla y de sus nodos padre (un nodo con varias primitivas es un Group). */
function collectNames(obj: Object3D, root: Object3D): string[] {
  const out = new Set<string>();
  for (let o: Object3D | null = obj; o && o !== root; o = o.parent) {
    const original = typeof o.userData?.name === "string" ? (o.userData.name as string) : "";
    if (original) out.add(original);
    if (o.name) out.add(o.name);
  }
  return [...out];
}

/**
 * La piel trae un atributo por vértice exportado desde Blender como "_FADE"
 * (GLTFLoader lo pasa a minúsculas: "_fade") que atenúa las manos. Se copia a
 * `aFade` para el shader; si falta, se usa 1 (sin atenuar).
 */
function prepareFade(geo: BufferGeometry) {
  const src = geo.getAttribute("_fade") ?? geo.getAttribute("_FADE") ?? geo.getAttribute("fade");
  if (src && src.itemSize === 1) {
    geo.setAttribute("aFade", src);
  } else {
    const n = geo.getAttribute("position").count;
    geo.setAttribute("aFade", new BufferAttribute(new Float32Array(n).fill(1), 1));
  }
}

/**
 * Longitud de un tubo: agrupa los vértices por uv.x en tramos, toma el
 * centroide de cada tramo y suma las distancias entre centroides.
 */
function tubeLength(geo: BufferGeometry, scale: number): number {
  const uv = geo.getAttribute("uv");
  const pos = geo.getAttribute("position");
  if (!uv || !pos) return 0;
  const BINS = 48;
  const acc = Array.from({ length: BINS }, () => ({ x: 0, y: 0, z: 0, n: 0 }));
  for (let i = 0; i < pos.count; i++) {
    const b = Math.min(BINS - 1, Math.max(0, Math.floor(uv.getX(i) * BINS)));
    const a = acc[b];
    a.x += pos.getX(i);
    a.y += pos.getY(i);
    a.z += pos.getZ(i);
    a.n++;
  }
  let len = 0;
  let prev: Vector3 | null = null;
  for (const a of acc) {
    if (!a.n) continue;
    const c = new Vector3(a.x / a.n, a.y / a.n, a.z / a.n);
    if (prev) len += c.distanceTo(prev);
    prev = c;
  }
  return len * scale;
}

function makePart(mesh: Mesh, names: string[], kind: PartKind, shared: SharedUniforms): Part {
  const geo = mesh.geometry;
  if (!geo.getAttribute("normal")) geo.computeVertexNormals();
  if (kind === "skin") prepareFade(geo);
  // Atributos que el shader no usa: menos memoria de GPU.
  if (kind !== "tube" && geo.getAttribute("uv")) geo.deleteAttribute("uv");
  if (geo.getAttribute("color")) geo.deleteAttribute("color");

  const u = createPartUniforms(shared, kind, names);
  const old = mesh.material;
  (Array.isArray(old) ? old : [old]).forEach((m) => m?.dispose());
  mesh.material = createPartMaterial(kind, u, kind === "skin");
  // Mezcla normal sin profundidad: la piel va primero y el hueso se dibuja
  // encima (si no, la piel lo "lava" según el orden de profundidad).
  mesh.renderOrder = kind === "skin" ? 0 : 1;
  if (kind === "tube") mesh.visible = false;

  mesh.updateMatrix();
  mesh.matrixAutoUpdate = false;
  const parentWorld = mesh.parent ? mesh.parent.matrixWorld.clone() : new Matrix4();
  const box = new Box3().setFromObject(mesh);
  const ws = new Vector3();
  mesh.getWorldScale(ws);
  return {
    mesh,
    names,
    kind,
    u,
    rest: mesh.matrix.clone(),
    parentWorld,
    parentInv: parentWorld.clone().invert(),
    box,
    center: box.getCenter(new Vector3()),
    size: box.getSize(new Vector3()),
    worldScale: Math.max(ws.x, 1e-6),
    length: kind === "tube" ? tubeLength(geo, ws.x) : 0,
    flowOffset: readFlowOffset(mesh),
    pain: 0,
    painTarget: 0,
    tone: 0,
    toneTarget: 0,
    delta: new Matrix4(),
    deformed: false,
    wasDeformed: false,
  };
}

/** `flow_offset` de los extras de glTF (en la malla o en su nodo padre). */
function readFlowOffset(mesh: Mesh): number {
  for (let o: Object3D | null = mesh; o; o = o.parent) {
    const v = (o.userData as { flow_offset?: unknown }).flow_offset;
    if (typeof v === "number" && v > 0 && v < 1) return v;
  }
  return 0;
}

/** Recorre la escena del .glb y convierte cada malla en una pieza de rayos X en tinta. */
export function buildParts(root: Object3D, shared: SharedUniforms): Part[] {
  root.updateMatrixWorld(true);
  const meshes: Mesh[] = [];
  root.traverse((o) => {
    if ((o as Mesh).isMesh) meshes.push(o as Mesh);
  });
  return meshes.map((mesh) => {
    const names = collectNames(mesh, root);
    return makePart(mesh, names, classify(names), shared);
  });
}

/** Tubo procedural sobre una curva Catmull-Rom: uv.x = 0 proximal → 1 distal. */
export function buildTube(def: TubeDef, root: Object3D, shared: SharedUniforms): Part {
  const curve = new CatmullRomCurve3(def.points.map((p) => new Vector3(p[0], p[1], p[2])), false, "centripetal");
  const geo = new TubeGeometry(curve, Math.max(48, def.points.length * 24), def.radius ?? 0.0035, 10, false);
  const mesh = new Mesh(geo);
  mesh.name = def.name;
  mesh.userData.name = def.name;
  root.add(mesh);
  mesh.updateMatrixWorld(true);
  return makePart(mesh, [def.name], "tube", shared);
}
