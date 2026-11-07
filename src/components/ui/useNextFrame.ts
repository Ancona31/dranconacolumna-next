"use client";

import { useEffect, useState } from "react";

/**
 * false en el primer render y true un cuadro después de montar. Lo usan los
 * popups de Base UI que se cargan bajo demanda (drawer, menús): si el
 * componente llega ya abierto, Base UI no anima la entrada (la trata como
 * contenido abierto desde el servidor). Montándolo cerrado y abriéndolo al
 * cuadro siguiente, la primera apertura se anima como las demás.
 */
export function useNextFrame(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready;
}
