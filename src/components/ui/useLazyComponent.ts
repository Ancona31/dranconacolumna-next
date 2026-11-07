"use client";

import { useCallback, useState, type ComponentType } from "react";

/**
 * Componente cargado bajo demanda con un import() simple: `request()` pide el
 * módulo (se llama al primer gesto de intención: hover, foco, toque) y el
 * componente queda disponible en cuanto llega; mientras tanto es null.
 *
 * No se usa next/dynamic a propósito: monta el componente dentro de un
 * Suspense y React 19 retiene ~300 ms la aparición del contenido suspendido,
 * así que la primera apertura del menú llegaba tarde aunque el código ya
 * estuviera descargado.
 */
export function useLazyComponent<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>,
): [ComponentType<P> | null, () => void] {
  const [Component, setComponent] = useState<ComponentType<P> | null>(null);
  const request = useCallback(() => {
    void load().then(
      (mod) => setComponent(() => mod.default),
      // Sin red: el próximo gesto lo vuelve a intentar.
      () => {},
    );
  }, [load]);
  return [Component, request];
}
