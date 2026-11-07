"use client";

import { useEffect, useState } from "react";

/** Alto por defecto del header sticky (celular), antes de medirlo. */
const FALLBACK = 68;

/**
 * Alto en vivo del header sticky del sitio (cambia con el ancho: en tablet
 * y PC grande muestra el lema en dos renglones). El escenario 3D se pega
 * justo debajo.
 */
export function useHeaderHeight(): number {
  const [h, setH] = useState(FALLBACK);
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const ro = new ResizeObserver(() => setH(Math.round(header.getBoundingClientRect().height)));
    ro.observe(header);
    return () => ro.disconnect();
  }, []);
  return h;
}
