import React from "react";
import QRCode from "qrcode";
import { Svg, Rect } from "@react-pdf/renderer";

type QrSvgProps = {
  value: string;
  /** Lado del QR en pt/px, incluyendo la quiet zone. */
  size: number;
  /**
   * Ignorado. El QR se fuerza a NEGRO PURO (#000000): las cámaras físicas leen
   * peor cualquier color de marca por menor contraste. Se conserva en la API
   * por compatibilidad con quien invoca (ReportPdf lo sigue pasando).
   */
  fg?: string;
  /** Placa de fondo clara detrás del QR + quiet zone. */
  bgPlate?: boolean;
};

const QUIET = 4; // celdas de margen (quiet zone), DENTRO de la placa. El
// estándar QR pide ≥4 módulos de silencio para lectura confiable.
const PLATE_RADIUS = 10; // rx generoso de la placa (pt)
// Negro puro sobre blanco: máximo contraste, el estándar universal que
// cualquier cámara de celular lee al instante. Se prioriza legibilidad sobre
// la estética de marca en este elemento.
const MODULE_COLOR = "#000000";

/**
 * QR vectorial nativo para react-pdf: QR clásico NEGRO sobre blanco. Módulos de
 * datos como cuadrados sólidos que se tocan (sin gap ni border-radius) y finder
 * patterns como cuadrados rectos (7×7 → 5×5 blanco → 3×3), respetando la razón
 * 1:1:3:1:1 que buscan las cámaras. Nada de imágenes rasterizadas. ECC 'M'.
 */
export default function QrSvg({ value, size, bgPlate = false }: QrSvgProps) {
  const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
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

  // Módulos de datos como cuadrados sólidos que se tocan (excluye finders y
  // quiet zone). Se suma un hairline al lado para eliminar costuras de
  // antialiasing entre módulos adyacentes y garantizar contraste continuo.
  const seam = cell * 0.03;
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!data[r * count + c]) continue;
      if (inFinder(r, c)) continue;
      shapes.push(
        <Rect
          key={`d-${r}-${c}`}
          x={off + c * cell}
          y={off + r * cell}
          width={cell + seam}
          height={cell + seam}
          fill={MODULE_COLOR}
        />
      );
    }
  }

  // Finder patterns (ojos) como cuadrados rectos, iguales a un QR clásico:
  // 7×7 sólido oscuro → 5×5 blanco → 3×3 sólido oscuro. Sin radio: prioridad
  // al contraste y a la razón 1:1:3:1:1 que las cámaras detectan al instante.
  finders.forEach(([fr, fc], i) => {
    const fx = off + fc * cell;
    const fy = off + fr * cell;
    shapes.push(
      <Rect
        key={`fo-${i}`}
        x={fx}
        y={fy}
        width={7 * cell}
        height={7 * cell}
        fill={MODULE_COLOR}
      />
    );
    shapes.push(
      <Rect
        key={`fw-${i}`}
        x={fx + cell}
        y={fy + cell}
        width={5 * cell}
        height={5 * cell}
        fill="#FFFFFF"
      />
    );
    shapes.push(
      <Rect
        key={`fc-${i}`}
        x={fx + 2 * cell}
        y={fy + 2 * cell}
        width={3 * cell}
        height={3 * cell}
        fill={MODULE_COLOR}
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
