"use client";

// src/components/home/BodyFigureSVG.tsx
// Silueta humana (vista posterior) adaptada de "Male body silhouette - back"
// de nicubunu (OpenClipart, dominio publico). Posiciones de zona calculadas
// geometricamente sobre el contorno real. NO ajustar el path a mano; las
// zonas se ajustan editando cx/cy en BODY_ZONES.

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type BodyZoneId =
  | "cuello" | "espalda-alta" | "espalda-baja" | "hombro" | "codo"
  | "muneca" | "cadera" | "rodilla" | "tobillo";

export interface BodyZone {
  id: BodyZoneId;
  label: string;
  cx: number;
  cy: number;
}

/** Zonas seleccionables. Fase 3 las hara interactivas. */
export const BODY_ZONES: BodyZone[] = [
  { id: "cuello", label: "Cuello", cx: 100, cy: 85 },
  { id: "espalda-alta", label: "Espalda alta", cx: 100, cy: 127 },
  { id: "espalda-baja", label: "Espalda baja", cx: 100, cy: 233 },
  { id: "hombro", label: "Hombro", cx: 47, cy: 107 },
  { id: "codo", label: "Codo", cx: 47, cy: 183 },
  { id: "muneca", label: "Muñeca y mano", cx: 52, cy: 300 },
  { id: "cadera", label: "Cadera", cx: 130, cy: 256 },
  { id: "rodilla", label: "Rodilla", cx: 117, cy: 410 },
  { id: "tobillo", label: "Tobillo y pie", cx: 109, cy: 506 },
];

export const BODY_PATH =
  "M 104 22 C 102.2 21.9, 89.4 21.9, 83.3 32.9 C 78.7 46.2, 78 66.6, 87.6 75 C 88.3 78.9, 88.3 83.4" +
  ", 86.8 86.3 C 76.3 96.2, 47.5 92.6, 39.5 99.8 C 25.8 115.8, 37.4 196.9, 39.6 202.4 C 31.4 224.2," +
  " 43.5 263.4, 43.8 275.7 C 46.7 284.1, 42.8 298.6, 54.5 309.9 C 53.8 300.9, 54.2 289.8, 53.4 276." +
  "9 C 54.3 264.5, 53.3 244, 56.1 229.4 C 55 222.9, 58.8 208.9, 56.2 202.8 C 61.5 193.3, 56.5 154.2" +
  ", 52.5 140.1 C 59 154.8, 63 189.1, 63.8 200.8 C 48.6 229.9, 51.3 324.1, 63.4 383.8 C 54.5 439.5," +
  " 69.6 466.7, 70.6 493.5 C 77.5 497, 64.6 515.5, 67.3 518.1 C 72.4 524.1, 87.2 522.5, 90.3 517.8 " +
  "C 91.9 514.6, 87.8 507.3, 88.9 502.1 C 88.6 497, 89 486.7, 89 482.3 C 89 478, 96.8 412.8, 94.7 3" +
  "91.4 C 96.7 385.5, 95.7 375.9, 95.6 365.4 C 97.3 357.1, 100.8 268.7, 100.7 268.4 C 100.7 268.6, " +
  "104.5 347.9, 102 356.2 C 99.4 365.4, 100.6 383.6, 100.1 390.7 C 97.5 404.1, 101.1 473.6, 101.1 4" +
  "77.9 C 101.1 482.2, 98.9 495.1, 98.5 500.3 C 99.6 505.5, 96 514.4, 97.7 517.6 C 100.8 522.3, 117" +
  ".1 522.3, 122.3 516.2 C 125 513.7, 113.4 495.8, 120.3 492.3 C 121.2 465.6, 136.1 434.5, 135 383." +
  "1 C 149 326.4, 149.3 240.1, 139.2 197.5 C 139.9 185.8, 145.1 153.5, 146.2 139.3 C 143.9 152.9, 1" +
  "42.4 194.7, 147.7 204.2 C 145.1 210.2, 145.7 222.2, 144.5 228.7 C 146.8 245.5, 145.8 263.2, 146." +
  "7 275.6 C 145.9 288.5, 146.4 300.1, 145.8 309.1 C 157.5 297.9, 153.5 283.4, 156.4 275 C 156.7 26" +
  "2.6, 171.5 223.4, 163.3 201.6 C 165.5 196.1, 171.5 117.6, 161.5 102.6 C 153.5 91.7, 127.1 94.9, " +
  "116.6 85 C 115.1 82.1, 115.1 76, 115.8 72.1 C 125.4 63.7, 124.7 46.6, 120.1 33.3 C 114.8 23.6, 1" +
  "09.5 22.3, 104 22 L 104 22 Z";

const SPINE_DOTS = Array.from({ length: 21 }, (_, i) => 89 + i * 8.5);
const APOPHYSIS_Y = [100, 128, 156, 184, 212, 240];

const INK = "var(--color-primary, #0B3C5D)";
const ACCENT = "var(--color-accent, #1B6CA8)";
const PAPER = "var(--color-background, #FBFBF9)";
const PAIN = "var(--color-pain, #D64541)";

/**
 * "selected" hay una zona elegida (o bajo el cursor): se anuncia con un chip.
 * "ambient" nadie ha elegido nada todavía, así que afirmar una zona sería
 * mentir: sin chip, el nodo de dolor recorre el cuerpo y `highlightedZone`
 * solo decide dónde empieza el recorrido.
 */
export type BodyFigureMode = "ambient" | "selected";

/** Recorrido del nodo de dolor en modo ambient: anatómico, de arriba abajo. */
const AMBIENT_TOUR: BodyZoneId[] = [
  "cuello",
  "hombro",
  "espalda-alta",
  "codo",
  "espalda-baja",
  "muneca",
  "cadera",
  "rodilla",
  "tobillo",
];

const TOUR_STEP_MS = 2800;

// CSS no anima `r`, así que el nodo activo crece con transform sobre su propia
// caja. Las escalas son los radios de antes (15 y 6.5) sobre los de reposo.
const HALO_ACTIVE_SCALE = 15 / 11;
const CORE_ACTIVE_SCALE = 6.5 / 5;

// Chip de zona (modo selected). Se dimensiona al texto porque etiquetas como
// "Muñeca y mano" no caben en un ancho fijo.
// F2.a: el viewBox se ensanchó a 300 para dar aire a los chips largos. La
// figura se dibuja en su sistema original y se centra con un desplazamiento de
// +40 en X (40 por lado); los chips se posicionan en el viewBox nuevo sumando
// ese offset al cx del nodo.
const VIEW_W = 300;
const FIGURE_OFFSET_X = 40;
const CHIP_CHAR_W = 7.4; // ancho medio de carácter a fontSize 12.5
const CHIP_PADDING_X = 14; // por lado
const CHIP_GAP = 18; // separación entre el nodo y el chip
const CHIP_MARGIN = 4; // margen mínimo contra el borde del viewBox
// Clearance mínima entre el borde del chip y el centro del nodo para darlo por
// "despejado". Por debajo, el chip taparía el nodo y se intenta el lado opuesto.
const CHIP_MIN_CLEAR = 8;

// Lado preferido del chip por zona. Regla explícita (antes se derivaba de
// cx > 110): a la izquierda del nodo salvo cadera/rodilla/tobillo, que van a la
// derecha. Es solo la preferencia: si en ese lado el chip no despeja el nodo
// (etiquetas anchas del brazo izquierdo como "Muñeca y mano" o "Shoulder"),
// buildChipModel lo pasa al lado opuesto cuando allí sí despeja.
const CHIP_SIDE: Record<BodyZoneId, "left" | "right"> = {
  cuello: "left",
  "espalda-alta": "left",
  "espalda-baja": "left",
  hombro: "left",
  codo: "left",
  muneca: "left",
  cadera: "right",
  rodilla: "right",
  tobillo: "right",
};

interface ChipModel {
  id: BodyZoneId;
  label: string;
  rectX: number;
  width: number;
  cy: number;
  /** Desplazamiento de entrada/salida (px) según el lado por el que aparece. */
  dx: string;
}

/** Coloca el chip a un lado del nodo, con clamp contra el viewBox, y devuelve
 *  su rectX y la clearance (px entre el borde del chip y el centro del nodo;
 *  negativa = lo tapa). */
function placeChip(
  nodeX: number,
  width: number,
  side: "left" | "right",
): { rectX: number; clearance: number } {
  const anchoredX =
    side === "left" ? nodeX - CHIP_GAP - width : nodeX + CHIP_GAP;
  const rectX = Math.min(
    Math.max(anchoredX, CHIP_MARGIN),
    VIEW_W - CHIP_MARGIN - width,
  );
  const clearance = side === "left" ? nodeX - (rectX + width) : rectX - nodeX;
  return { rectX, clearance };
}

/** Geometría del chip de una zona: ancho por longitud de etiqueta y lado
 *  preferido (CHIP_SIDE). Si en el lado preferido el chip no despeja el nodo
 *  (clearance < CHIP_MIN_CLEAR) y en el opuesto despeja mejor, se cambia de
 *  lado; el clamp mantiene el chip dentro del viewBox en ambos casos. */
function buildChipModel(zone: BodyZone, label: string): ChipModel {
  const width = Math.round(label.length * CHIP_CHAR_W + CHIP_PADDING_X * 2);
  // El nodo vive en el sistema original; su X en el viewBox nuevo es cx + offset.
  const nodeX = zone.cx + FIGURE_OFFSET_X;

  let side = CHIP_SIDE[zone.id];
  let placement = placeChip(nodeX, width, side);
  if (placement.clearance < CHIP_MIN_CLEAR) {
    const other = side === "left" ? "right" : "left";
    const otherPlacement = placeChip(nodeX, width, other);
    if (otherPlacement.clearance > placement.clearance) {
      side = other;
      placement = otherPlacement;
    }
  }

  return {
    id: zone.id,
    label,
    rectX: placement.rectX,
    width,
    cy: zone.cy,
    dx: side === "left" ? "-4px" : "4px",
  };
}

/**
 * Chip de zona (modo "selected"). Entra y sale con fade + desplazamiento leve
 * desde su lado (CSS en globals.css, clase body-figure__chip). El estado final
 * queda fijado por `both`, y prefers-reduced-motion lo vuelve instantáneo por
 * la regla global. La copia "exit" se autolimpia con onAnimationEnd.
 */
function Chip({
  model,
  kind,
  onExited,
}: {
  model: ChipModel;
  kind: "enter" | "exit";
  onExited?: () => void;
}) {
  return (
    <g
      className={`body-figure__chip is-${kind}`}
      style={{ "--chip-dx": model.dx } as CSSProperties}
      onAnimationEnd={kind === "exit" ? onExited : undefined}
    >
      <rect
        x={model.rectX}
        y={model.cy - 14}
        width={model.width}
        height="28"
        rx="14"
        fill={INK}
      />
      <text
        x={model.rectX + model.width / 2}
        y={model.cy + 4.5}
        textAnchor="middle"
        fontFamily="inherit"
        fontSize="12.5"
        fontWeight="600"
        fill={PAPER}
      >
        {model.label}
      </text>
    </g>
  );
}

/** aria-label por defecto (contexto ES) cuando la figura no es decorativa. */
const DEFAULT_ARIA =
  "Figura humana vista de espaldas con las zonas del cuerpo que puedes evaluar";

interface BodyFigureSVGProps {
  highlightedZone?: BodyZoneId;
  mode?: BodyFigureMode;
  className?: string;
  /**
   * Override de etiquetas por zona para el chip del modo "selected". Sin él, el
   * chip usa la etiqueta interna en español de BODY_ZONES (contexto ES).
   */
  zoneLabels?: Partial<Record<BodyZoneId, string>>;
  /**
   * aria-label de la figura. Por defecto, el español interno; las páginas EN
   * pasan aquí su traducción. Se ignora si `decorative`.
   */
  ariaLabel?: string;
  /**
   * Cuando un ancestro ya etiqueta la figura (p. ej. el <Link> del hero), se
   * marca decorativa (aria-hidden) para no duplicar el nombre accesible.
   */
  decorative?: boolean;
}

export default function BodyFigureSVG({
  highlightedZone,
  mode = "ambient",
  className,
  zoneLabels,
  ariaLabel,
  decorative = false,
}: BodyFigureSVGProps) {
  const hot = BODY_ZONES.find((z) => z.id === highlightedZone);
  const ambient = mode === "ambient";

  // El servidor y el primer render del cliente parten de la misma zona, así
  // que el tour puede arrancar después sin provocar hydration mismatch. En modo
  // ambient sin zona explícita se conserva el arranque histórico (espalda-baja);
  // en modo selected el valor es indiferente (no se usa el tour).
  const tourStart = Math.max(
    0,
    AMBIENT_TOUR.indexOf(highlightedZone ?? "espalda-baja"),
  );
  const [tourIndex, setTourIndex] = useState(tourStart);

  useEffect(() => {
    if (!ambient) return;

    // SMIL y este intervalo ignoran prefers-reduced-motion por su cuenta:
    // con reduce, el recorrido no arranca y la figura se queda quieta.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const sync = () => {
      stop();
      if (reduced.matches) {
        setTourIndex(tourStart);
        return;
      }
      timer = setInterval(
        () => setTourIndex((i) => (i + 1) % AMBIENT_TOUR.length),
        TOUR_STEP_MS,
      );
    };

    sync();
    reduced.addEventListener("change", sync);
    return () => {
      stop();
      reduced.removeEventListener("change", sync);
    };
  }, [ambient, tourStart]);

  const activeZone = ambient ? AMBIENT_TOUR[tourIndex] : highlightedZone;

  // Chip del modo "selected". Se calcula en el render (SSR-safe: el chip inicial
  // sale ya pintado). Al cambiar de zona, el chip anterior se mantiene montado
  // como copia "exit" para animar su salida mientras el nuevo entra.
  const currentChip =
    !ambient && hot ? buildChipModel(hot, zoneLabels?.[hot.id] ?? hot.label) : null;
  const [exitingChip, setExitingChip] = useState<ChipModel | null>(null);
  const prevChipRef = useRef<ChipModel | null>(currentChip);

  useEffect(() => {
    const prev = prevChipRef.current;
    prevChipRef.current = currentChip;
    // Solo hay salida que animar cuando cambia la zona (no en el primer montaje
    // ni al re-renderizar la misma zona).
    if (prev && prev.id !== (currentChip?.id ?? null)) {
      setExitingChip(prev);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChip?.id]);

  return (
    <svg
      viewBox="0 0 300 540"
      className={className}
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": ariaLabel ?? DEFAULT_ARIA })}
    >
      {/* La figura y sus nodos se dibujan en su sistema original (ancho 220) y
          se centran en el viewBox de 300 desplazándose +40 en X. Los chips van
          FUERA de este grupo, en coordenadas del viewBox nuevo, para poder usar
          todo el ancho al posicionarse. */}
      <g transform={`translate(${FIGURE_OFFSET_X},0)`}>
        {/* Silueta rellena, estilo diagrama clinico */}
        <path
          d={BODY_PATH}
          fill={ACCENT}
          opacity="0.16"
        />
      <path
        d={BODY_PATH}
        fill="none"
        stroke={INK}
        strokeOpacity="0.42"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Columna vertebral insinuada */}
      <g fill={INK} opacity="0.55">
        {SPINE_DOTS.map((y) => (
          <circle key={y} cx="100" cy={y} r="1.4" />
        ))}
      </g>
      <g stroke={INK} strokeWidth="1.4" opacity="0.32" strokeLinecap="round">
        {APOPHYSIS_Y.map((y) => (
          <path key={y} d={`M 95 ${y} L 105 ${y}`} />
        ))}
      </g>

      {/* Zonas. Los halos estáticos van debajo de los que laten, para que al
          ocultar los pulsos con prefers-reduced-motion la figura siga entera. */}
      {ambient ? (
        <g>
          {/* Cada nodo lleva sus dos pulsos siempre corriendo y cruza opacidad
              al entrar o salir del recorrido: así el rojo nunca salta de golpe.
              Ambos pulsos son SMIL, la misma técnica en toda la figura. */}
          {BODY_ZONES.map((z, i) => {
            const active = z.id === activeZone;
            const stagger = `${(i * 0.35).toFixed(2)}s`;

            return (
              <g key={z.id}>
                <circle
                  className="body-figure__halo"
                  cx={z.cx}
                  cy={z.cy}
                  r="11"
                  fill={active ? PAIN : ACCENT}
                  opacity={active ? 0.25 : 0.18}
                  style={active ? { transform: `scale(${HALO_ACTIVE_SCALE})` } : undefined}
                />

                {/* Latido azul de reposo, escalonado por índice. */}
                <g className="body-figure__pulse" opacity={active ? 0 : 1}>
                  <circle cx={z.cx} cy={z.cy} r="11" fill={ACCENT} opacity="0.2">
                    <animate
                      attributeName="r"
                      values="11;15;11"
                      dur="3.2s"
                      begin={stagger}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.06;0.2"
                      dur="3.2s"
                      begin={stagger}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                {/* Pulso de dolor, visible solo mientras la zona es la activa. */}
                <g className="body-figure__pulse" opacity={active ? 1 : 0}>
                  <circle cx={z.cx} cy={z.cy} r="15" fill={PAIN} opacity="0.3">
                    <animate attributeName="r" values="15;21;15" dur="2.6s" repeatCount="indefinite" />
                    <animate
                      attributeName="opacity"
                      values="0.3;0.06;0.3"
                      dur="2.6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                <circle
                  className="body-figure__core"
                  cx={z.cx}
                  cy={z.cy}
                  r="5"
                  fill={active ? PAIN : INK}
                  stroke={PAPER}
                  strokeWidth="2"
                  style={active ? { transform: `scale(${CORE_ACTIVE_SCALE})` } : undefined}
                />
              </g>
            );
          })}
        </g>
      ) : (
        <g>
          {BODY_ZONES.filter((z) => z.id !== highlightedZone).map((z) => (
            <g key={z.id}>
              <circle cx={z.cx} cy={z.cy} r="11" fill={ACCENT} opacity="0.18" />
              <circle cx={z.cx} cy={z.cy} r="5" fill={INK} stroke={PAPER} strokeWidth="2" />
            </g>
          ))}

          {hot && (
            <g>
              <circle cx={hot.cx} cy={hot.cy} r="15" fill={ACCENT} opacity="0.22" />
              <circle
                className="body-figure__pulse"
                cx={hot.cx}
                cy={hot.cy}
                r="15"
                fill={ACCENT}
                opacity="0.3"
              >
                <animate attributeName="r" values="15;21;15" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.06;0.3" dur="2.6s" repeatCount="indefinite" />
              </circle>
              <circle cx={hot.cx} cy={hot.cy} r="6.5" fill={INK} stroke={PAPER} strokeWidth="2.2" />
            </g>
          )}
        </g>
      )}
      </g>

      {/* Chip de zona destacada (lado por CHIP_SIDE + clamp). La copia saliente
          va primero para quedar debajo del chip entrante durante el relevo. */}
      {!ambient && (
        <>
          {exitingChip && (
            <Chip
              key={`exit-${exitingChip.id}`}
              model={exitingChip}
              kind="exit"
              onExited={() =>
                setExitingChip((c) => (c?.id === exitingChip.id ? null : c))
              }
            />
          )}
          {currentChip && (
            <Chip key={`chip-${currentChip.id}`} model={currentChip} kind="enter" />
          )}
        </>
      )}
    </svg>
  );
}
