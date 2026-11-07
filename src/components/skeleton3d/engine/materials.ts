import {
  AdditiveBlending,
  Color,
  DoubleSide,
  ShaderMaterial,
  Vector2,
  Vector4,
  type IUniform,
} from "three";

/**
 * Material "rayos X" (el de la demo aprobada `demo_L4_dolor.html`): el brillo
 * depende del ángulo entre la superficie y la cámara (fresnel). Bordes que
 * brillan, interior translúcido, mezcla aditiva sin escribir profundidad.
 * El dolor mezcla hacia #ff5236 y late; nunca se vuelve rojo sólido.
 */

export const COLORS = {
  bone: "#9cc7e4",
  // Discos: un poco más claros y cálidos que el hueso.
  disc: "#d6e4e6",
  skin: "#8fbadb",
  tube: "#c2e2f7",
  pain: "#ff5236",
  flow: "#ffc6b3",
  // Resalte "calm" del recorrido guiado: azul claro, más vivo que el hueso.
  calm: "#a8d4f2",
} as const;

/** Uniforms compartidos por todos los materiales (un solo objeto por motor). */
export type SharedUniforms = {
  uPulse: IUniform<number>;
  uMaster: IUniform<number>;
};

/**
 * Uniforms propios de cada pieza. Los de tubo existen en todas las piezas
 * por simplicidad; el programa de hueso simplemente no los lee.
 */
export type PartUniforms = SharedUniforms & {
  uBase: IUniform<Color>;
  /** Color del tinte de esta pieza: mezcla de dolor y "calm" según `uTone`. */
  uPainColor: IUniform<Color>;
  /** 0 = dolor, 1 = calm (recorrido guiado): atenúa el latido. */
  uTone: IUniform<number>;
  uGain: IUniform<number>;
  uRimPow: IUniform<number>;
  uPain: IUniform<number>;
  uFlash: IUniform<number>;
  /** Punto caliente: xyz en espacio del modelo, w = radio (0 = toda la pieza). */
  uHot: IUniform<Vector4>;
  // Tubos (nervios, canal)
  uVisible: IUniform<number>;
  uFlow: IUniform<number>;
  uHead: IUniform<number>;
  uWidth: IUniform<number>;
  uDir: IUniform<number>;
  uBreathe: IUniform<number>;
  uPinch: IUniform<number>;
  uRange: IUniform<Vector2>;
  uFlowColor: IUniform<Color>;
};

export type PartKind = "bone" | "disc" | "skin" | "tube";

export function createSharedUniforms(): SharedUniforms {
  return {
    uPulse: { value: 0.5 },
    uMaster: { value: 1 },
  };
}

const XRAY_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vW;
  #ifdef USE_FADE
    attribute float aFade;
    varying float vFade;
  #endif
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vW = (modelMatrix * vec4(position, 1.0)).xyz;
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    #ifdef USE_FADE
      vFade = aFade;
    #endif
    gl_Position = projectionMatrix * mv;
  }
`;

const XRAY_FRAG = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uPainColor;
  uniform float uPain;
  uniform float uPulse;
  uniform float uTone;
  uniform float uGain;
  uniform float uRimPow;
  uniform float uFlash;
  uniform float uMaster;
  uniform vec4 uHot;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vW;
  #ifdef USE_FADE
    varying float vFade;
  #endif
  void main() {
    float facing = abs(dot(normalize(vN), normalize(vV)));
    float rim = pow(1.0 - facing, uRimPow);
    // Punto caliente opcional: el dolor se desvanece con la distancia.
    float pain = uPain;
    if (uHot.w > 0.0) pain *= 1.0 - smoothstep(uHot.w * 0.3, uHot.w, distance(vW, uHot.xyz));
    vec3 col = mix(uBase, uPainColor, pain);
    // Tono "calm": el latido casi se aplana (resalte sereno, no alarma).
    float pulse = mix(uPulse, 0.6, uTone * 0.75);
    // Con dolor, el interior también se enciende y late (igual que la demo).
    float core = pain * (0.05 + 0.09 * pulse) * (1.0 - rim);
    float a = rim * (0.9 + 0.5 * pain * pulse) + 0.05 + core;
    // "Calm" no late fuerte: para que se lea como resalte, gana brillo propio.
    a *= 1.0 + 0.9 * pain * uTone;
    // Destello breve (fractura): blanco cálido, sin saturar a sólido.
    col = mix(col, vec3(1.0, 0.93, 0.88), uFlash * 0.55);
    a += uFlash * (0.25 + 0.45 * rim);
    float g = uGain * uMaster;
    #ifdef USE_FADE
      g *= vFade;
    #endif
    a *= g;
    gl_FragColor = vec4(col * a, a);
  }
`;

const TUBE_VERT = /* glsl */ `
  uniform float uPinch;
  uniform vec2 uRange;
  varying vec3 vN;
  varying vec3 vV;
  varying vec2 vUv;
  void main() {
    // Estrechamiento: la pared se hunde hacia el eje en el tramo uRange (uv.x).
    float w = smoothstep(uRange.x, uRange.x + 0.08, uv.x)
            * (1.0 - smoothstep(uRange.y - 0.08, uRange.y, uv.x));
    vec3 p = position - normal * uPinch * w;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vUv = uv;
    gl_Position = projectionMatrix * mv;
  }
`;

const TUBE_FRAG = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uPainColor;
  uniform vec3 uFlowColor;
  uniform float uPain;
  uniform float uVisible;
  uniform float uFlow;
  uniform float uHead;
  uniform float uWidth;
  uniform float uDir;
  uniform float uBreathe;
  uniform float uMaster;
  varying vec3 vN;
  varying vec3 vV;
  varying vec2 vUv;
  void main() {
    float facing = abs(dot(normalize(vN), normalize(vV)));
    float rim = pow(1.0 - facing, 1.6);
    // Pulso viajero: frente corto y cola larga detrás (según la dirección).
    float d = (vUv.x - uHead) * uDir;
    float w = d < 0.0 ? uWidth * 2.2 : uWidth * 0.6;
    float pulse = exp(-(d * d) / max(w * w, 1e-5));
    float glow = uFlow * pulse + uBreathe;
    vec3 col = mix(mix(uBase, uPainColor, uPain), uFlowColor, clamp(glow, 0.0, 1.0) * 0.85);
    float a = uVisible * (rim * 0.75 + 0.12) + glow * (0.55 + 0.45 * rim);
    a *= uMaster;
    gl_FragColor = vec4(col * a, a);
  }
`;

const KIND_STYLE: Record<PartKind, { color: string; gain: number; rimPow: number }> = {
  bone: { color: COLORS.bone, gain: 1, rimPow: 2.2 },
  disc: { color: COLORS.disc, gain: 0.95, rimPow: 2.0 },
  // Piel: fantasma, mucho más tenue que el hueso y con borde más suave.
  skin: { color: COLORS.skin, gain: 0.2, rimPow: 2.6 },
  tube: { color: COLORS.tube, gain: 1, rimPow: 1.6 },
};

export function createPartUniforms(shared: SharedUniforms, kind: PartKind): PartUniforms {
  const st = KIND_STYLE[kind];
  return {
    // Los compartidos se pasan por referencia: un solo cambio llega a todos.
    uPulse: shared.uPulse,
    uMaster: shared.uMaster,
    uBase: { value: new Color(st.color) },
    uPainColor: { value: new Color(COLORS.pain) },
    uTone: { value: 0 },
    uGain: { value: st.gain },
    uRimPow: { value: st.rimPow },
    uPain: { value: 0 },
    uFlash: { value: 0 },
    uHot: { value: new Vector4(0, 0, 0, 0) },
    uVisible: { value: 0 },
    uFlow: { value: 0 },
    uHead: { value: -1 },
    uWidth: { value: 0.12 },
    uDir: { value: 1 },
    uBreathe: { value: 0 },
    uPinch: { value: 0 },
    uRange: { value: new Vector2(0.25, 0.75) },
    uFlowColor: { value: new Color(COLORS.flow) },
  };
}

/**
 * Un material por pieza (cada una tiene su propio nivel de dolor). three.js
 * reutiliza el mismo programa GLSL para todas las del mismo tipo.
 */
export function createPartMaterial(kind: PartKind, uniforms: PartUniforms, withFade: boolean): ShaderMaterial {
  const tube = kind === "tube";
  return new ShaderMaterial({
    uniforms: uniforms as unknown as Record<string, IUniform>,
    vertexShader: tube ? TUBE_VERT : XRAY_VERT,
    fragmentShader: tube ? TUBE_FRAG : XRAY_FRAG,
    defines: withFade ? { USE_FADE: "" } : {},
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
  });
}
