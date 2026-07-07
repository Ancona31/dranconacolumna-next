// src/components/home/BodyFigureSVG.tsx
// Silueta humana (vista posterior) adaptada de "Male body silhouette - back"
// de nicubunu (OpenClipart, dominio publico). Posiciones de zona calculadas
// geometricamente sobre el contorno real. NO ajustar el path a mano; las
// zonas se ajustan editando cx/cy en BODY_ZONES.

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
  { id: "muneca", label: "Muñeca y mano", cx: 54, cy: 286 },
  { id: "cadera", label: "Cadera", cx: 143, cy: 283 },
  { id: "rodilla", label: "Rodilla", cx: 117, cy: 410 },
  { id: "tobillo", label: "Tobillo y pie", cx: 109, cy: 506 },
];

const BODY_PATH =
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

interface BodyFigureSVGProps {
  highlightedZone?: BodyZoneId;
  showChip?: boolean;
  className?: string;
}

export default function BodyFigureSVG({
  highlightedZone = "espalda-baja",
  showChip = true,
  className,
}: BodyFigureSVGProps) {
  const hot = BODY_ZONES.find((z) => z.id === highlightedZone);

  return (
    <svg
      viewBox="0 0 220 540"
      className={className}
      role="img"
      aria-label="Figura humana vista de espaldas con las zonas del cuerpo que puedes evaluar"
    >
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

      {/* Zonas */}
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
            <circle cx={hot.cx} cy={hot.cy} r="15" fill={ACCENT} opacity="0.3">
              <animate attributeName="r" values="15;21;15" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.06;0.3" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle cx={hot.cx} cy={hot.cy} r="6.5" fill={INK} stroke={PAPER} strokeWidth="2.2" />
          </g>
        )}
      </g>

      {/* Chip de zona destacada */}
      {showChip && hot && (
        <g>
          <rect x={hot.cx + 18} y={hot.cy - 14} width="92" height="28" rx="14" fill={INK} />
          <text
            x={hot.cx + 64}
            y={hot.cy + 4.5}
            textAnchor="middle"
            fontFamily="inherit"
            fontSize="12.5"
            fontWeight="600"
            fill={PAPER}
          >
            {hot.label} →
          </text>
        </g>
      )}
    </svg>
  );
}
