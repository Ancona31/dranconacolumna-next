/**
 * Contrato público del motor 3D del esqueleto (plan §8.2 / §8.3).
 *
 * Este archivo NO importa three.js: lo pueden usar los escenarios (datos) y
 * cualquier componente sin arrastrar el motor al bundle inicial.
 *
 * Convenciones del modelo (las debe respetar el .glb de Blender):
 * - Y hacia arriba, metros, escala humana real, pies cerca de y = 0.
 * - El paciente mira hacia +Z (anterior = +Z, posterior = −Z).
 * - Izquierda del paciente = +X, derecha del paciente = −X.
 */

/** Vector en metros, espacio del modelo. */
export type Vec3 = readonly [number, number, number];

/**
 * Referencia a una o varias piezas del .glb: nombre exacto (original de
 * Blender o el de contrato §8.1, p. ej. "v_L4") o una expresión regular.
 */
export type MeshRef = string | RegExp;

/** Dirección anatómica (relativa al paciente) o vector libre en metros. */
export type Direction =
  | "anterior"
  | "posterior"
  | "superior"
  | "inferior"
  | "left"
  | "right"
  | Vec3;

/** Encuadres con nombre, definidos relativos a los límites del modelo. */
export type CameraPresetName =
  | "full_F" // cuerpo completo de frente (reposo)
  | "lumbar_L" // lateral derecho, zoom lumbar
  | "leg_P" // posterior, de cintura a pie (pierna derecha)
  | "cervical_34" // tres cuartos, cuello y hombro derecho
  | "shoulder_34" // tres cuartos frontal, hombro derecho
  | "elbow_L" // lateral del codo derecho
  | "wrist_mid" // media distancia: antebrazo + mano derechos
  | "knee_F" // frontal, rodilla derecha
  | "hip_34" // tres cuartos frontal, cadera derecha
  | "thoracolumbar_L" // lateral, unión toracolumbar (T12–L1)
  | "spine_P"; // posterior, columna completa

/**
 * Encuadre libre. Mismas unidades que los presets: `target` en metros para
 * un modelo de referencia de 1.75 m, medido desde el centro X/Z y desde el
 * suelo (mínimo Y) del modelo; se escala con la altura real.
 */
export type CameraPose = {
  target: Vec3;
  /** Grados alrededor de Y. 0 = frente (+Z), 180 = espalda, −90 = lado derecho. */
  azimuth: number;
  /** Grados sobre el horizonte. */
  elevation: number;
  /** Ancho y alto (m, referencia 1.75 m) que deben caber en el encuadre. */
  frame: { w: number; h: number };
};

/**
 * Pieza con color de dolor. `strength` 0..1 (1 = dolor pleno).
 * Con `at`, el dolor se concentra en un punto caliente (p. ej. el epicóndilo)
 * y se desvanece a `radius` metros; `at` usa el mismo sistema que
 * `CameraPose.target`. En "sequence" se ignora `at`.
 */
export type TintSpec = { mesh: MeshRef; strength: number; at?: Vec3; radius?: number };

/** El disco (u otra pieza) se abulta hacia `direction` `amount` metros, al ritmo del latido. */
export type BulgeEffect = {
  type: "bulge";
  mesh: MeshRef;
  direction: Direction;
  /** Metros (p. ej. 0.0025 = 2.5 mm). */
  amount: number;
  /** Si late con el pulso del dolor (por defecto true). */
  pulse?: boolean;
};

/**
 * Pulso de luz que recorre un tubo (nervio). El tubo debe tener uv.x = 0 en
 * el extremo proximal (columna) y uv.x = 1 en el distal.
 */
export type NerveFlowEffect = {
  type: "nerveFlow";
  mesh: MeshRef;
  /** "travel" = pulso viajero (defecto); "breathe" = el tubo entero se enciende y apaga. */
  mode?: "travel" | "breathe";
  /** Segundos por recorrido / ciclo (defecto 2.2; usar múltiplos de 1.1 s, el latido). */
  period?: number;
  /** Ancho del pulso como fracción de la longitud (defecto 0.12). */
  width?: number;
  /** Intensidad 0..1 (defecto 1). */
  strength?: number;
  /** Recorre de distal a proximal. */
  reverse?: boolean;
};

/** El canal medular (tubo) se estrecha y se relaja. */
export type CanalPinchEffect = {
  type: "canalPinch";
  mesh: MeshRef;
  /** Metros que se hunde la pared del tubo hacia su eje (defecto 0.0025). */
  amount?: number;
  /** Tramo del tubo (uv.x) que se estrecha (defecto [0.25, 0.75]). */
  range?: readonly [number, number];
  /** Segundos por ciclo (defecto 3.3; múltiplo de 1.1 s). */
  period?: number;
};

/** Desliza piezas `amount` metros hacia `direction` y regresa (espondilolistesis). */
export type SlideEffect = {
  type: "slide";
  mesh: MeshRef;
  direction: Direction;
  amount: number;
  /** Segundos por ida y vuelta (defecto 3.3; múltiplo de 1.1 s). */
  period?: number;
};

/** La columna pasa de recta a curva en "S" (escoliosis), se sostiene y regresa. */
export type ScoliosisEffect = {
  type: "scoliosis";
  /** Vértebras y discos de la curva; se ordenan por altura automáticamente. */
  mesh: MeshRef;
  /** Piezas que siguen la curva a su altura (costillas, esternón…). */
  attach?: MeshRef;
  /** Desplazamiento lateral máximo en metros (defecto 0.016). */
  amplitude?: number;
  /** Rotación axial máxima en grados (defecto 6). */
  rotation?: number;
  /** Duración de las fases en segundos: entrar, sostener, salir, pausa (defecto 1.1/2.2/1.1/1.1). */
  timing?: { in?: number; hold?: number; out?: number; rest?: number };
};

/** Aplastamiento de una pieza sobre un eje con destello breve (fractura). */
export type CompressEffect = {
  type: "compress";
  mesh: MeshRef;
  /** Eje de compresión (defecto "superior"). */
  axis?: Direction;
  /** Fracción de altura que se pierde (defecto 0.18). */
  amount?: number;
  /** Destello al comprimir (defecto true). */
  flash?: boolean;
  /** Segundos por ciclo completo (defecto 3.3; múltiplo de 1.1 s). */
  period?: number;
};

/** Recorre grupos de piezas encendiendo su tinte por turnos. */
export type SequenceEffect = {
  type: "sequence";
  steps: readonly (readonly TintSpec[])[];
  /** Segundos por paso (defecto 1.1, el latido). */
  stepDuration?: number;
};

export type Effect =
  | BulgeEffect
  | NerveFlowEffect
  | CanalPinchEffect
  | SlideEffect
  | ScoliosisEffect
  | CompressEffect
  | SequenceEffect;

/**
 * Tono del resalte. "pain" (defecto) = rojo de dolor con latido; "calm" =
 * azul claro suave, sin alarma (recorrido guiado de reposo: "esto también lo
 * atiendo").
 */
export type Tone = "pain" | "calm";

/**
 * Movimiento de cámara una vez que llegó al encuadre. "still" (defecto) =
 * fija; "spin" = giro lento (~1 vuelta por minuto). El reposo siempre queda
 * quieto (D1).
 */
export type CameraMotion = "still" | "spin";

export type ScenarioDef = {
  id: string;
  camera: CameraPresetName | CameraPose;
  tint: readonly TintSpec[];
  /** Uno o varios efectos simultáneos. */
  effect?: Effect | readonly Effect[];
  /**
   * Imagen fija de este escenario: se ve sin WebGL, en modo "static", si se
   * pierde el contexto y mientras el 3D carga.
   */
  poster?: string;
  /** Color del tinte (defecto "pain"). */
  tone?: Tone;
  /** Movimiento de cámara una vez que llegó (defecto "still"). */
  motion?: CameraMotion;
};

/** Parada del recorrido guiado: un escenario y cuánto se queda tras llegar. */
export type IdleTourStop = ScenarioDef & {
  /** Segundos de estancia después del viaje de cámara (~1.1 s) (defecto 2.4). */
  dwell?: number;
};

/**
 * Recorrido guiado de reposo (plan §3.2, D1): mientras nadie interactúa, la
 * cámara recorre las paradas en orden UNA vez por visita y luego queda la
 * vista general quieta (el render se detiene). La primera interacción
 * (escenario activo por hover, foco o scroll-spy; arrastre; pausa) lo apaga
 * para el resto de la visita. Con el puntero sobre el lienzo se queda en la
 * parada actual y sigue `resumeDelay` s después de salir. Con "reducir
 * movimiento" no corre. El tiempo solo avanza con el lienzo en pantalla.
 */
export type IdleTour = {
  stops: readonly IdleTourStop[];
  /** Segundos en reposo antes de la primera parada (defecto 2.5). */
  startDelay?: number;
  /** Segundos tras sacar el puntero del lienzo antes de seguir (defecto 4). */
  resumeDelay?: number;
  /** Repetir sin fin (defecto false: una vuelta y vista general quieta). */
  loop?: boolean;
};

export type Quality = "auto" | "high" | "low" | "static";

/** Tubo procedural (nervio, canal) generado en el navegador sobre una curva Catmull-Rom. */
export type TubeDef = {
  name: string;
  /** Puntos de control en metros, espacio del modelo, de proximal a distal. */
  points: readonly Vec3[];
  /** Radio en metros (defecto 0.0035). */
  radius?: number;
};

export type Skeleton3DProps = {
  /** Definición del escenario activo; null = reposo. */
  scenario: ScenarioDef | null;
  quality?: Quality;
  /** Arrastrar para girar (solo PC con puntero fino). */
  interactive?: boolean;
  /** Imagen de reposo / respaldo mientras carga o sin WebGL. */
  posterSrc?: string;
  /** Ruta del .glb, o una por calidad (interno: solo el banco de pruebas). */
  modelSrc?: string | { high: string; low: string };
  /** Tubos procedurales extra (interno: solo el banco de pruebas). */
  extraTubes?: readonly TubeDef[];
  /** Recorrido guiado mientras `scenario` es null; sin él, el reposo es la vista general quieta. */
  idleTour?: IdleTour | null;
  /**
   * Pausa (WCAG 2.2.2): congela recorrido, giro, latido y efectos y detiene
   * el render; al quitarla todo sigue desde donde estaba. Cuenta como
   * interacción: el recorrido guiado ya no vuelve en esta visita. Un cambio
   * de escenario en pausa se muestra fijo, sin animación.
   */
  paused?: boolean;
  /**
   * Prioridad de la imagen fija. "high" = carga inmediata y prioridad alta
   * (cuando es el LCP, p. ej. /padecimientos); "low" (defecto) = diferida.
   */
  posterPriority?: "high" | "low";
};
