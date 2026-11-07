import { MathUtils, Vector3, type Box3, type PerspectiveCamera } from "three";
import type { CameraPose, CameraPresetName } from "../types";

/**
 * Encuadres con nombre. Unidades: metros para un modelo de referencia de
 * 1.75 m; `target` se mide desde el centro X/Z y desde el suelo del modelo.
 * Lado derecho del paciente = −X, así que la vista lateral derecha usa
 * azimut −90°. Las vistas traseras (`spine_P`, `leg_P`) usan −160° para
 * girar siempre hacia la derecha del paciente, como las demás, y no media
 * vuelta exacta. Valores medidos sobre el modelo a escala real.
 */
export const CAMERA_PRESETS: Readonly<Record<CameraPresetName, CameraPose>> = {
  full_F: { target: [0, 0.875, 0], azimuth: 0, elevation: 4, frame: { w: 0.78, h: 1.92 } },
  lumbar_L: { target: [0, 1.04, -0.03], azimuth: -90, elevation: 4, frame: { w: 0.3, h: 0.32 } },
  leg_P: { target: [-0.06, 0.56, -0.03], azimuth: -160, elevation: 6, frame: { w: 0.5, h: 1.18 } },
  cervical_34: { target: [-0.1, 1.34, -0.03], azimuth: -38, elevation: 6, frame: { w: 0.5, h: 0.72 } },
  shoulder_34: { target: [-0.15, 1.4, -0.02], azimuth: -35, elevation: 8, frame: { w: 0.3, h: 0.3 } },
  // "Lateral del brazo": de perfil puro el codo se encima con el tronco; a
  // −40° se separa y el epicóndilo (cara externa) queda de frente.
  elbow_L: { target: [-0.23, 1.13, 0], azimuth: -40, elevation: 8, frame: { w: 0.26, h: 0.28 } },
  wrist_mid: { target: [-0.26, 0.92, 0.02], azimuth: -30, elevation: 4, frame: { w: 0.35, h: 0.48 } },
  knee_F: { target: [-0.085, 0.48, -0.005], azimuth: -12, elevation: 4, frame: { w: 0.3, h: 0.32 } },
  hip_34: { target: [-0.085, 0.92, -0.02], azimuth: -30, elevation: 6, frame: { w: 0.36, h: 0.36 } },
  thoracolumbar_L: { target: [0, 1.17, -0.03], azimuth: -90, elevation: 4, frame: { w: 0.3, h: 0.32 } },
  spine_P: { target: [0, 1.23, -0.04], azimuth: -160, elevation: 4, frame: { w: 0.5, h: 0.86 } },
};

export const REST_PRESET: CameraPresetName = "full_F";

type Comp = "tx" | "ty" | "tz" | "az" | "el" | "ld";
const COMPS: readonly Comp[] = ["tx", "ty", "tz", "az", "el", "ld"];
type RigState = Record<Comp, number>;

const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const EL_MIN = -0.5;
const EL_MAX = 1.05;
/** Giro mayor a 90°: respuesta mínima para no barrer la escena (apple-design). */
const WIDE_TURN = Math.PI / 2;
export const WIDE_TURN_RESPONSE = 0.7;
/** Inercia al soltar un arrastre: segundos de velocidad que se proyectan. */
const FLING = 0.22;
const DRAG_RESPONSE = 0.55;

/**
 * Cámara orbital propia: objetivo + azimut/elevación/distancia. Cada
 * componente sigue a su destino con un spring críticamente amortiguado
 * (sin rebote): conserva la velocidad al cambiar de destino a medio viaje,
 * arranca con aceleración suave y la duración crece sola con la distancia.
 * La distancia se interpola en escala logarítmica (`ld` = ln(dist)) para que
 * acercarse y alejarse se sientan simétricos. La distancia se calcula para
 * que el `frame` del encuadre quepa con el aspecto actual del lienzo.
 */
export class CameraRig {
  /** Estado actual (ld = logaritmo de la distancia). */
  readonly cur: RigState = { tx: 0, ty: 0, tz: 0, az: 0, el: 0, ld: Math.log(3) };
  private vel: RigState = { tx: 0, ty: 0, tz: 0, az: 0, el: 0, ld: 0 };
  private to: RigState = { ...this.cur };
  private goal: CameraPose = CAMERA_PRESETS[REST_PRESET];
  /** Frecuencia angular del spring: ω = 2π / response. */
  private omega = (Math.PI * 2) / 0.55;
  private moving = false;
  private base = new Vector3();
  private scale = 1;

  constructor(private camera: PerspectiveCamera) {}

  /** Ajusta los presets a los límites reales del modelo. */
  setBounds(box: Box3) {
    const c = box.getCenter(new Vector3());
    this.base.set(c.x, box.min.y, c.z);
    this.scale = (box.max.y - box.min.y) / 1.75;
  }

  /** Convierte un punto de referencia (sistema de `CameraPose.target`) a espacio del modelo. */
  toModel(v: readonly [number, number, number], out = new Vector3()) {
    return out.set(this.base.x + v[0] * this.scale, this.base.y + v[1] * this.scale, this.base.z + v[2] * this.scale);
  }

  /** Escala del modelo respecto a la referencia de 1.75 m. */
  get modelScale() {
    return this.scale;
  }

  /** La cámara todavía se mueve (viaje, inercia o asentamiento). */
  get transitioning() {
    return this.moving;
  }

  get azimuth() {
    return this.cur.az;
  }

  private solve(pose: CameraPose, nearAz: number): RigState {
    const s = this.scale;
    const cam = this.camera;
    const tanV = Math.tan(MathUtils.degToRad(cam.fov / 2));
    const distH = (pose.frame.h * s) / 2 / tanV;
    const distW = (pose.frame.w * s) / 2 / (tanV * Math.max(cam.aspect, 0.1));
    const az = MathUtils.degToRad(pose.azimuth);
    return {
      tx: this.base.x + pose.target[0] * s,
      ty: this.base.y + pose.target[1] * s,
      tz: this.base.z + pose.target[2] * s,
      // Camino corto: el azimut destino se elige cerca del actual.
      az: nearAz + wrapPi(az - nearAz),
      el: MathUtils.degToRad(pose.elevation),
      ld: Math.log(Math.max(distH, distW, 1e-3)),
    };
  }

  /**
   * Viaja al encuadre con un spring de `response` segundos (corta si es 0).
   * Si el giro pasa de 90°, la respuesta sube a 0.7 s. `azimuthOverride` en
   * radianes. Devuelve la respuesta usada (los efectos esperan ese tiempo).
   */
  go(pose: CameraPose, response: number, azimuthOverride?: number): number {
    this.goal = azimuthOverride === undefined ? pose : { ...pose, azimuth: MathUtils.radToDeg(azimuthOverride) };
    this.to = this.solve(this.goal, this.cur.az);
    if (response <= 0) {
      this.snap();
      return 0;
    }
    const r = Math.abs(this.to.az - this.cur.az) > WIDE_TURN ? Math.max(response, WIDE_TURN_RESPONSE) : response;
    this.omega = (Math.PI * 2) / r;
    this.moving = true;
    return r;
  }

  /** Salta al destino sin animación. */
  snap() {
    Object.assign(this.cur, this.to);
    for (const k of COMPS) this.vel[k] = 0;
    this.moving = false;
  }

  /** Recalcula la distancia tras un cambio de aspecto. */
  refit() {
    this.to.ld = this.solve(this.goal, this.cur.az).ld;
    if (!this.moving) this.cur.ld = this.to.ld;
  }

  /**
   * Arrastre del usuario: la cámara sigue al puntero (el destino es la
   * posición actual) y la velocidad del spring guarda la del gesto.
   */
  drag(dAz: number, dEl: number, dt: number) {
    for (const k of COMPS) this.to[k] = this.cur[k];
    this.cur.az += dAz;
    this.cur.el = MathUtils.clamp(this.cur.el + dEl, EL_MIN, EL_MAX);
    this.to.az = this.cur.az;
    this.to.el = this.cur.el;
    for (const k of COMPS) this.vel[k] = 0;
    if (dt > 0) {
      this.vel.az = dAz / dt;
      this.vel.el = dEl / dt;
    }
    this.moving = false;
  }

  /**
   * Al soltar: la inercia es el mismo spring, con destino proyectado en la
   * dirección del gesto. `fling` = false si el puntero llevaba quieto un rato.
   */
  release(fling: boolean) {
    if (!fling) {
      this.vel.az = this.vel.el = 0;
      return;
    }
    this.to.az = this.cur.az + this.vel.az * FLING;
    this.to.el = MathUtils.clamp(this.cur.el + this.vel.el * FLING, EL_MIN, EL_MAX);
    this.omega = (Math.PI * 2) / DRAG_RESPONSE;
    this.moving = true;
  }

  /** Giro lento (parada con `motion: "spin"`): mueve la cámara y su destino. */
  spin(dAz: number) {
    this.cur.az += dAz;
    this.to.az += dAz;
  }

  /** Avanza un cuadro; devuelve true si sigue habiendo movimiento. */
  update(dt: number, dragging: boolean): boolean {
    if (dragging || !this.moving) {
      this.apply();
      return dragging;
    }
    // Spring críticamente amortiguado, solución exacta (estable con cualquier dt).
    const w = this.omega;
    const e = Math.exp(-w * dt);
    const posEps = 1e-4 * this.scale;
    let settled = true;
    for (const k of COMPS) {
      const a = this.cur[k] - this.to[k];
      const v = this.vel[k];
      const c = v + w * a;
      this.cur[k] = this.to[k] + (a + c * dt) * e;
      this.vel[k] = (v - w * c * dt) * e;
      const eps = k === "tx" || k === "ty" || k === "tz" ? posEps : 1e-4;
      if (Math.abs(this.cur[k] - this.to[k]) > eps || Math.abs(this.vel[k]) > eps * 10) settled = false;
    }
    if (settled) this.snap();
    this.apply();
    return true;
  }

  apply() {
    const { tx, ty, tz, az, el, ld } = this.cur;
    const dist = Math.exp(ld);
    const ce = Math.cos(el);
    this.camera.position.set(tx + dist * ce * Math.sin(az), ty + dist * Math.sin(el), tz + dist * ce * Math.cos(az));
    this.camera.near = Math.max(0.005, dist * 0.05);
    this.camera.far = dist + 4;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(tx, ty, tz);
  }
}

export function poseFor(camera: CameraPresetName | CameraPose): CameraPose {
  return typeof camera === "string" ? (CAMERA_PRESETS[camera] ?? CAMERA_PRESETS[REST_PRESET]) : camera;
}
