import type { ConditionSlug } from "@/lib/conditions";
import type {
  CameraPose,
  IdleTour,
  IdleTourStop,
  ScenarioDef,
  TintSpec,
} from "@/components/skeleton3d/types";

/**
 * Escenarios del esqueleto 3D por padecimiento (plan §4) y recorrido guiado
 * de reposo (plan §3.2). Solo datos: no importa three.js, así que entra al
 * bundle sin arrastrar el motor.
 *
 * Coordenadas (`at`, `target`): metros en el sistema de referencia del motor
 * (modelo de 1.75 m, X/Z desde el centro, Y desde el suelo). Paciente mirando
 * a +Z; derecha del paciente = −X. Los puntos se midieron sobre las mallas de
 * public/models/skeleton-high.glb (BodyParts3D a escala real).
 *
 * Lado del dolor unilateral: DERECHO (decisión D5).
 * Movimientos en milímetros reales; el dolor nunca es rojo sólido (lo
 * garantiza el material) y late a ~1.1 s. Los periodos de los efectos son
 * múltiplos de 1.1 s (2.2, 3.3) para que no se crucen con el latido.
 */

/** Imagen fija de respaldo (plan §5). Los archivos se agregan después. */
export const posterFor = (id: string) => `/img/skeleton/posters/${id}.avif`;

/** Imagen de reposo (respaldo sin WebGL / equipo modesto / sin JavaScript). */
export const REST_POSTER = posterFor("reposo");

// ── Puntos anatómicos medidos (lado derecho) ────────────────────────────
const P = {
  /** Meseta superior de S1. */
  s1Endplate: [0, 1.005, -0.03],
  /** Centro de la cabeza humeral. */
  humeralHead: [-0.158, 1.405, -0.02],
  /** Glenoides / acromion. */
  glenoid: [-0.163, 1.418, -0.032],
  /** Extremo lateral de la clavícula (articulación acromioclavicular). */
  acJoint: [-0.142, 1.428, -0.012],
  /** Epicóndilo lateral del húmero. */
  latEpicondyle: [-0.241, 1.15, -0.036],
  /** Cabeza del radio. */
  radialHead: [-0.232, 1.121, -0.023],
  /** Olécranon / cúbito proximal. */
  ulnaProx: [-0.21, 1.14, -0.038],
  /** Radio distal (muñeca). */
  radiusDist: [-0.262, 0.912, 0.017],
  /** Cúbito distal. */
  ulnaDist: [-0.238, 0.91, 0.017],
  /** Carpo (túnel del carpo, cara palmar). */
  carpus: [-0.258, 0.882, 0.036],
  /** Centro de la cabeza femoral. */
  femoralHead: [-0.081, 0.907, -0.019],
  /** Acetábulo. */
  acetabulum: [-0.088, 0.918, -0.02],
  /** Fémur distal (cóndilos). */
  femurDist: [-0.075, 0.49, -0.012],
  /** Tibia proximal (platillos). */
  tibiaProx: [-0.077, 0.462, -0.016],
  /** Tibia distal (maléolo medial). */
  tibiaDist: [-0.068, 0.1, -0.02],
  /** Peroné distal (maléolo lateral). */
  fibulaDist: [-0.096, 0.09, -0.036],
  /** Astrágalo (articulación del tobillo). */
  talus: [-0.08, 0.078, 0.0],
} as const satisfies Record<string, readonly [number, number, number]>;

/** Espejo al lado izquierdo (X positiva). */
const L = (v: readonly [number, number, number]) => [-v[0], v[1], v[2]] as const;

// ── Encuadres propios (los demás son presets del motor) ─────────────────
const CAM_CANAL: CameraPose = {
  // Tres cuartos posterior derecho, zoom lumbar L2–S1.
  target: [0, 1.06, -0.04],
  azimuth: -145,
  elevation: 10,
  frame: { w: 0.3, h: 0.34 },
};
const CAM_LISTHESIS: CameraPose = {
  // Lateral derecho, zoom L4–S1.
  target: [0, 1.02, -0.035],
  azimuth: -90,
  elevation: 4,
  frame: { w: 0.24, h: 0.25 },
};
const CAM_CIATICA: CameraPose = {
  // Posterior tres cuartos derecho, de L4 al pie. Más alto y con aire arriba
  // que `leg_P`: el origen lumbar (L5–S1, y ≈ 1.0) ya no queda pegado al
  // borde superior en celular.
  target: [-0.05, 0.62, -0.03],
  azimuth: -160,
  elevation: 6,
  frame: { w: 0.5, h: 1.34 },
};
const CAM_MIEMBROS_R: CameraPose = {
  // Tres cuartos frontal derecho, del pie a la muñeca (tobillo, rodilla y
  // muñeca derechos): ~1.6× más cerca que el cuerpo completo, para que la
  // zona roja se lea en el escenario del celular.
  target: [-0.14, 0.53, 0],
  azimuth: -20,
  elevation: 4,
  frame: { w: 0.42, h: 1.22 },
};
const CAM_DEPORTIVAS: CameraPose = {
  // Tres cuartos frontal derecho, del pie al hombro (rodilla, hombro y
  // tobillo derechos): sin la cabeza ni el lado izquierdo.
  target: [-0.11, 0.8, 0],
  azimuth: -20,
  elevation: 4,
  frame: { w: 0.48, h: 1.72 },
};

// ── Tintes reutilizados ──────────────────────────────────────────────────
const KNEE_R: TintSpec[] = [
  { mesh: "femur_R", strength: 0.75, at: P.femurDist, radius: 0.08 },
  { mesh: "patella_R", strength: 1 },
  { mesh: "tibia_R", strength: 0.75, at: P.tibiaProx, radius: 0.08 },
];

// Pasos de las secuencias multi-zona (en "sequence" se ignora `at`: la pieza
// entera se enciende, por eso los huesos largos van tenues).
const STEP_ANKLE: TintSpec[] = [
  { mesh: "foot_R", strength: 1 },
  { mesh: "tibia_R", strength: 0.3 },
  { mesh: "fibula_R", strength: 0.35 },
];
const STEP_WRIST: TintSpec[] = [
  { mesh: "hand_R", strength: 0.9 },
  { mesh: "radius_R", strength: 0.45 },
  { mesh: "ulna_R", strength: 0.35 },
];
const STEP_KNEE: TintSpec[] = [
  { mesh: "patella_R", strength: 1 },
  { mesh: "femur_R", strength: 0.3 },
  { mesh: "tibia_R", strength: 0.3 },
];
const STEP_SHOULDER: TintSpec[] = [
  { mesh: "humerus_R", strength: 0.5 },
  { mesh: "scapula_R", strength: 0.55 },
  { mesh: "clavicle_R", strength: 0.45 },
];

/** Columna por encima de L5 (vértebras, discos) + tórax: se mueve en bloque con L5. */
const ABOVE_L5 = /^(v_[CT]\d+|v_L[1-5]|d_C\dC\d|d_C7T1|d_T\d+T\d+|d_T12L1|d_L[1-4]L[2-5]|ribs|sternum)$/;

type ScenarioBody = Omit<ScenarioDef, "id" | "poster">;

const BODIES: Record<ConditionSlug, ScenarioBody> = {
  // 1 · Disco L4–L5 abultado hacia atrás (posterolateral derecho, lo más
  // común), 4.5 mm al ritmo del latido (exagerado a pedido del cirujano
  // para que se lea en el celular).
  "hernia-de-disco": {
    camera: "lumbar_L",
    tint: [
      { mesh: "v_L4", strength: 0.3 },
      { mesh: "v_L5", strength: 0.3 },
      { mesh: "d_L4L5", strength: 1 },
    ],
    effect: { type: "bulge", mesh: "d_L4L5", direction: [-0.35, 0, -1], amount: 0.006 },
  },

  // 2 · Pulso por el ciático derecho (y su rama peronea) desde L5–S1 hasta el
  // pie, 2.2 s por recorrido (2 latidos).
  ciatica: {
    camera: CAM_CIATICA,
    tint: [
      { mesh: "v_L5", strength: 0.45 },
      { mesh: "sacrum", strength: 0.35 },
      { mesh: "d_L5S1", strength: 0.9 },
    ],
    effect: { type: "nerveFlow", mesh: /^n_(sciatic|peroneal)_R$/, period: 2.2 },
  },

  // 3 · El canal medular se estrecha ~4 mm en L3–L5 y se relaja; el nervio
  // de la pierna se enciende tenue por intervalos (claudicación neurógena).
  "canal-lumbar-estrecho": {
    camera: CAM_CANAL,
    tint: [
      { mesh: /^v_L[3-5]$/, strength: 0.55 },
      { mesh: /^d_L(3L4|4L5)$/, strength: 0.4 },
    ],
    effect: [
      // uv.x del canal: 0 en T12 (y 1.22) → 1 en S1 (y 0.97); L3–L5 ≈ 0.45–0.88.
      { type: "canalPinch", mesh: "canal_lumbar", amount: 0.004, range: [0.45, 0.88], period: 3.3 },
      // Claudicación neurógena: ambas piernas (ciático y peroneo derecho e izquierdo).
      { type: "nerveFlow", mesh: /^n_(sciatic|peroneal)_[RL]$/, mode: "breathe", strength: 0.45, period: 3.3 },
    ],
  },

  // 4 · Espondilolistesis L5–S1: L5 (y la columna por encima, en bloque)
  // avanza 9 mm sobre el sacro y regresa (grado I, ~25 % de la meseta).
  "vertebra-desplazada": {
    camera: CAM_LISTHESIS,
    tint: [
      { mesh: "v_L5", strength: 0.9 },
      { mesh: "d_L5S1", strength: 0.6 },
      // Solo la meseta de S1, no el sacro entero.
      { mesh: "sacrum", strength: 0.5, at: P.s1Endplate, radius: 0.04 },
    ],
    effect: { type: "slide", mesh: ABOVE_L5, direction: "anterior", amount: 0.009, period: 3.3 },
  },

  // 5 · Escoliosis: de recta a curva en "S" (torácica derecha, lumbar
  // izquierda), se sostiene y regresa. 28 mm de desviación lateral y 10° de
  // rotación axial máximos (exagerado para que se lea).
  "desviacion-de-columna": {
    camera: "spine_P",
    tint: [{ mesh: /^v_(T\d+|L\d)$/, strength: 0.35 }],
    effect: {
      type: "scoliosis",
      mesh: /^(v_T\d+|v_L\d|d_T\d+T\d+|d_T12L1|d_L\dL\d)$/,
      attach: /^(ribs|sternum)$/,
      amplitude: 0.028,
      rotation: 10,
    },
  },

  // 6 · Fractura por compresión de L1 (aplastamiento parejo del ~28 % de la
  // altura) con un destello breve; T12 tenue.
  "fractura-de-columna": {
    camera: "thoracolumbar_L",
    tint: [
      { mesh: "v_T12", strength: 0.35 },
      { mesh: "v_L1", strength: 1 },
    ],
    effect: { type: "compress", mesh: "v_L1", amount: 0.28, period: 3.3 },
  },

  // 7 · C4–C7 y sus discos; pulso tenue por la raíz cervical hacia el brazo
  // derecho (irradiación).
  "dolor-de-cuello": {
    camera: "cervical_34",
    tint: [
      { mesh: /^v_C[4-7]$/, strength: 0.6 },
      { mesh: /^(d_C[4-6]C[5-7]|d_C7T1)$/, strength: 0.75 },
    ],
    effect: { type: "nerveFlow", mesh: "n_cervical_R", strength: 0.6, period: 2.2 },
  },

  // 8 · Varias zonas: tobillo → muñeca → rodilla, 1.1 s cada una.
  "fracturas-y-esguinces": {
    camera: CAM_MIEMBROS_R,
    tint: [],
    effect: { type: "sequence", stepDuration: 1.1, steps: [STEP_ANKLE, STEP_WRIST, STEP_KNEE] },
  },

  // 9 · Articulación glenohumeral: cabeza del húmero, glenoides y
  // acromioclavicular.
  "dolor-de-hombro": {
    camera: "shoulder_34",
    tint: [
      { mesh: "humerus_R", strength: 1, at: P.humeralHead, radius: 0.065 },
      { mesh: "scapula_R", strength: 0.85, at: P.glenoid, radius: 0.07 },
      { mesh: "clavicle_R", strength: 0.55, at: P.acJoint, radius: 0.065 },
    ],
  },

  // 10 · Punto caliente en el epicóndilo lateral (epicondilitis), amplio y
  // pleno; cabeza del radio y olécranon tenues.
  "dolor-de-codo": {
    camera: "elbow_L",
    tint: [
      { mesh: "humerus_R", strength: 1, at: P.latEpicondyle, radius: 0.042 },
      { mesh: "radius_R", strength: 0.55, at: P.radialHead, radius: 0.04 },
      { mesh: "ulna_R", strength: 0.3, at: P.ulnaProx, radius: 0.04 },
    ],
  },

  // 11 · Fémur distal, rótula y tibia proximal; la rótula late (1 mm).
  "dolor-de-rodilla": {
    camera: "knee_F",
    tint: KNEE_R,
    effect: { type: "bulge", mesh: "patella_R", direction: "anterior", amount: 0.001 },
  },

  // 12 · Cabeza femoral y acetábulo.
  "dolor-de-cadera": {
    camera: "hip_34",
    tint: [
      { mesh: "femur_R", strength: 1, at: P.femoralHead, radius: 0.065 },
      { mesh: "hip_R", strength: 0.85, at: P.acetabulum, radius: 0.07 },
    ],
  },

  // 13 · Carpo, radio y cúbito distales; pulso por el nervio mediano hacia
  // los dedos. Cámara a media distancia (antebrazo + mano), nunca la palma.
  "dolor-de-muneca-y-mano": {
    camera: "wrist_mid",
    tint: [
      { mesh: "hand_R", strength: 0.8, at: P.carpus, radius: 0.055 },
      { mesh: "radius_R", strength: 0.75, at: P.radiusDist, radius: 0.055 },
      { mesh: "ulna_R", strength: 0.55, at: P.ulnaDist, radius: 0.05 },
    ],
    effect: { type: "nerveFlow", mesh: "n_median_R", period: 2.2 },
  },

  // 14 · Varias zonas: rodilla → hombro → tobillo, 1.1 s cada una.
  "lesiones-deportivas": {
    camera: CAM_DEPORTIVAS,
    tint: [],
    effect: { type: "sequence", stepDuration: 1.1, steps: [STEP_KNEE, STEP_SHOULDER, STEP_ANKLE] },
  },
};

/** Escenario por padecimiento; `id` = slug y su imagen fija según la convención. */
export const CONDITION_SCENARIOS = Object.fromEntries(
  (Object.entries(BODIES) as [ConditionSlug, ScenarioBody][]).map(([slug, body]) => [
    slug,
    { id: slug, poster: posterFor(slug), ...body },
  ]),
) as Readonly<Record<ConditionSlug, ScenarioDef>>;

// ── Recorrido guiado de reposo (plan §3.2) ──────────────────────────────
// Cervicales → hombro → mano → lumbar → rodilla → tobillo (derechos) →
// tobillo y rodilla izquierdos → vista general. Resalte "calm" (azul tinta),
// viaje de ~1.5 s con curva suave y cámara quieta en cada parada.
// Decisión D1 del dueño: el recorrido completo, con ambas piernas, UNA sola
// vuelta por visita (`loop: false`) y después la vista general quieta. Sin
// vaivén.


const stop = (s: Omit<IdleTourStop, "tone" | "motion"> & Partial<IdleTourStop>): IdleTourStop => ({
  tone: "calm",
  motion: "still",
  ...s,
});

const ankle = (side: "R" | "L"): IdleTourStop => {
  const m = (v: readonly [number, number, number]) => (side === "R" ? v : L(v));
  return stop({
    id: `tour-tobillo-${side}`,
    camera: {
      target: m([-0.082, 0.085, 0.0]),
      azimuth: side === "R" ? -28 : 28,
      elevation: 12,
      frame: { w: 0.26, h: 0.26 },
    },
    tint: [
      { mesh: `tibia_${side}`, strength: 0.6, at: m(P.tibiaDist), radius: 0.055 },
      { mesh: `fibula_${side}`, strength: 0.6, at: m(P.fibulaDist), radius: 0.055 },
      { mesh: `foot_${side}`, strength: 0.55, at: m(P.talus), radius: 0.07 },
    ],
  });
};

export const IDLE_TOUR: IdleTour = {
  startDelay: 2.5,
  resumeDelay: 4,
  loop: false,
  stops: [
    stop({
      id: "tour-cervical",
      camera: { target: [-0.03, 1.47, -0.03], azimuth: -35, elevation: 6, frame: { w: 0.3, h: 0.34 } },
      tint: [
        { mesh: /^v_C[1-7]$/, strength: 0.6 },
        { mesh: /^(d_C\dC\d|d_C7T1)$/, strength: 0.55 },
      ],
    }),
    stop({
      id: "tour-hombro-R",
      camera: "shoulder_34",
      tint: [
        { mesh: "humerus_R", strength: 0.7, at: P.humeralHead, radius: 0.06 },
        { mesh: "scapula_R", strength: 0.55, at: P.glenoid, radius: 0.065 },
        { mesh: "clavicle_R", strength: 0.4, at: P.acJoint, radius: 0.06 },
      ],
    }),
    stop({
      id: "tour-mano-R",
      camera: "wrist_mid",
      tint: [
        { mesh: "hand_R", strength: 0.6 },
        { mesh: "radius_R", strength: 0.5, at: P.radiusDist, radius: 0.06 },
        { mesh: "ulna_R", strength: 0.45, at: P.ulnaDist, radius: 0.06 },
      ],
    }),
    stop({
      id: "tour-lumbar",
      camera: { target: [0, 1.05, -0.035], azimuth: -150, elevation: 8, frame: { w: 0.32, h: 0.36 } },
      tint: [
        { mesh: /^v_L[1-5]$/, strength: 0.55 },
        { mesh: /^(d_L\dL\d|d_L5S1)$/, strength: 0.5 },
        { mesh: "sacrum", strength: 0.3 },
      ],
    }),
    stop({ id: "tour-rodilla-R", camera: "knee_F", tint: KNEE_R.map((t) => ({ ...t, strength: t.strength * 0.65 })) }),
    ankle("R"),
    ankle("L"),
    stop({
      id: "tour-rodilla-L",
      camera: { target: L([-0.085, 0.48, -0.005]), azimuth: 12, elevation: 4, frame: { w: 0.3, h: 0.32 } },
      tint: [
        { mesh: "femur_L", strength: 0.4, at: L(P.femurDist), radius: 0.07 },
        { mesh: "patella_L", strength: 0.65 },
        { mesh: "tibia_L", strength: 0.4, at: L(P.tibiaProx), radius: 0.07 },
      ],
    }),
    // De regreso arriba: vista general quieta, sin resalte (fin de la vuelta).
    stop({ id: "tour-general", camera: "full_F", tint: [], dwell: 5 }),
  ],
};
