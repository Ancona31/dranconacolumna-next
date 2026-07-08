import React from "react";
import QRCode from "qrcode";
import { Svg, Rect, Circle } from "@react-pdf/renderer";

type QrSvgProps = {
  value: string;
  /** Lado del QR en pt/px, incluyendo la quiet zone. */
  size: number;
  /** Color de módulos y patrones. */
  fg: string;
  /** Placa de fondo clara detrás del QR + quiet zone. */
  bgPlate?: boolean;
};

const QUIET = 2; // celdas de margen (quiet zone), DENTRO de la placa
const PLATE_RADIUS = 10; // rx generoso de la placa (pt)

/**
 * QR vectorial nativo para react-pdf: módulos de datos como puntos redondos y
 * finder patterns dibujados a mano (anillo + núcleo redondeados). Color
 * parametrizado. Nada de imágenes rasterizadas.
 */
export default function QrSvg({ value, size, fg, bgPlate = false }: QrSvgProps) {
  const qr = QRCode.create(value, { errorCorrectionLevel: "L" });
  const count = qr.modules.size;
  const data = qr.modules.data;

  const cell = size / (count + QUIET * 2);
  const off = QUIET * cell;

  const finders: Array<[number, number]> = [
    [0, 0],
    [0, count - 7],
    [count - 7, 0],
  ];
  const inFinder = (r: number, c: number) =>
    (r < 7 && c < 7) ||
    (r < 7 && c >= count - 7) ||
    (r >= count - 7 && c < 7);

  // Se construye un arreglo plano de primitivos (sin Fragments dentro del Svg).
  const shapes: React.ReactElement[] = [];

  // Módulos de datos como puntos redondos (excluye finders y quiet zone).
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!data[r * count + c]) continue;
      if (inFinder(r, c)) continue;
      shapes.push(
        <Circle
          key={`d-${r}-${c}`}
          cx={off + (c + 0.5) * cell}
          cy={off + (r + 0.5) * cell}
          r={cell * 0.42}
          fill={fg}
        />
      );
    }
  }

  // Finder patterns dibujados a mano: anillo exterior + núcleo, redondeados.
  finders.forEach(([fr, fc], i) => {
    shapes.push(
      <Rect
        key={`fo-${i}`}
        x={off + fc * cell}
        y={off + fr * cell}
        width={7 * cell}
        height={7 * cell}
        rx={2.2 * cell}
        ry={2.2 * cell}
        stroke={fg}
        strokeWidth={cell}
        fill="none"
      />
    );
    shapes.push(
      <Rect
        key={`fi-${i}`}
        x={off + (fc + 2) * cell}
        y={off + (fr + 2) * cell}
        width={3 * cell}
        height={3 * cell}
        rx={1.1 * cell}
        ry={1.1 * cell}
        fill={fg}
      />
    );
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {bgPlate && (
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          rx={PLATE_RADIUS}
          ry={PLATE_RADIUS}
          fill="#FFFFFF"
        />
      )}
      {shapes}
    </Svg>
  );
}
