"use client";

import { useSyncExternalStore } from "react";

// Una función de suscripción estable por consulta: useSyncExternalStore
// vuelve a suscribirse si la identidad cambia entre renders.
const subscribers = new Map<string, (cb: () => void) => () => void>();

function subscribeTo(query: string) {
  let fn = subscribers.get(query);
  if (!fn) {
    fn = (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    };
    subscribers.set(query, fn);
  }
  return fn;
}

/**
 * ¿Coincide la media query? En el servidor (y en la hidratación) devuelve
 * `serverValue`, así el HTML inicial no depende del dispositivo.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    subscribeTo(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
