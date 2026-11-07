"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { ConditionSlug } from "@/lib/conditions";

type Options = {
  /** Solo sin hover de PC y con pantalla alta (D4-A); si no, mandan el hover y el foco. */
  enabled: boolean;
  /** Escenario fijo (sticky): la línea de activación va bajo él (o a su lado en PC táctil). */
  stageRef: RefObject<HTMLElement | null>;
  /** Contenedor de las tarjetas `[data-condition]`. */
  listRef: RefObject<HTMLElement | null>;
  /** Cambia cuando cambia el layout (p. ej. el alto del header): recalcula la línea. */
  layoutKey?: number;
  onChange: (slug: ConditionSlug | null) => void;
};

/**
 * Tiempo que la línea debe quedarse sobre la misma tarjeta antes de
 * confirmarla. Un deslizón cruza una tarjeta cada 40–80 ms: sin esta espera
 * la cámara 3D cambiaría de destino en cada una (latigazo). Al leer despacio
 * no se nota.
 */
const SETTLE_MS = 180;

/** "Sin decidir": obliga a emitir la siguiente tarjeta aunque coincida. */
const UNKNOWN = Symbol("unknown");

/**
 * Scroll-spy de tarjetas: la más cercana a la línea de activación (centro
 * del área visible bajo el escenario fijo, hasta la barra de acciones móvil)
 * activa su animación. Arriba de la primera tarjeta o debajo de la última
 * vuelve al reposo.
 *
 * - La línea se mide con `documentElement.clientHeight` (viewport pequeño):
 *   la barra de URL de iOS/Android cambia `innerHeight` al ocultarse y movía
 *   la línea sin que el dedo se moviera. Los resize que no cambian ni el
 *   ancho ni ese alto se ignoran.
 * - Una tarjeta nueva se confirma tras `SETTLE_MS` estable, o al terminar el
 *   scroll (`scrollend`, donde exista).
 * - El foco de teclado manda: mientras una tarjeta tiene `:focus-visible`,
 *   el spy no cambia nada (el foco ya activó su escenario).
 *
 * Lecturas de layout solo en un rAF por evento de scroll (14 rectángulos,
 * sin escrituras: no fuerza reflow).
 */
export function useScrollSpy({ enabled, stageRef, listRef, layoutKey, onChange }: Options) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!enabled) return;
    const list = listRef.current;
    const stage = stageRef.current;
    if (!list || !stage) return;

    let current: ConditionSlug | null | typeof UNKNOWN = null;
    /** Candidata esperando confirmación; `undefined` = nada pendiente. */
    let pending: ConditionSlug | null | undefined;
    let line = 0;
    let raf = 0;
    let settle = 0;
    let lastW = window.innerWidth;
    let lastVh = document.documentElement.clientHeight;

    // Solo las tarjetas visibles en este ancho (la variante oculta tiene
    // display: none y offsetParent null).
    const cards = () =>
      Array.from(list.querySelectorAll<HTMLElement>("[data-condition]")).filter((el) => el.offsetParent !== null);

    const focusedCard = () => {
      const el = document.activeElement;
      return el instanceof HTMLElement && list.contains(el) && el.matches(":focus-visible");
    };

    const measureLine = () => {
      const vh = document.documentElement.clientHeight;
      // Borde inferior del escenario ya fijo: su `top` sticky + su alto. En
      // PC táctil (escenario al lado de las listas) la franja empieza bajo
      // el header.
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const first = cards()[0];
      const beside = !!first && first.getBoundingClientRect().left >= stage.getBoundingClientRect().right - 1;
      const top = beside ? stickyTop : stickyTop + stage.offsetHeight;
      const bar = document.querySelector<HTMLElement>("[data-mobile-action-bar]");
      const bottomEdge = vh - (bar?.offsetHeight ?? 0);
      line = Math.round(top + Math.max(0, bottomEdge - top) / 2);
      line = Math.min(Math.max(line, 0), vh - 1);
    };

    // La tarjeta más cercana a la línea (distancia 0 si la cruza). Fuera del
    // rango de la lista → reposo.
    const candidate = (): ConditionSlug | null => {
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      let minTop = Infinity;
      let maxBottom = -Infinity;
      for (const el of cards()) {
        const r = el.getBoundingClientRect();
        minTop = Math.min(minTop, r.top);
        maxBottom = Math.max(maxBottom, r.bottom);
        const d = line < r.top ? r.top - line : line > r.bottom ? line - r.bottom : 0;
        if (d < bestD) {
          bestD = d;
          best = el;
        }
      }
      if (!best || line < minTop || line > maxBottom) return null;
      return best.dataset.condition as ConditionSlug;
    };

    const commit = () => {
      window.clearTimeout(settle);
      settle = 0;
      if (pending === undefined) return;
      const slug = pending;
      pending = undefined;
      if (slug === current) return;
      current = slug;
      onChangeRef.current(slug);
    };

    const evaluate = () => {
      raf = 0;
      const next = focusedCard() ? current : candidate();
      if (next === current) {
        pending = undefined;
        window.clearTimeout(settle);
        return;
      }
      if (next === UNKNOWN || next === pending) return;
      pending = next;
      window.clearTimeout(settle);
      settle = window.setTimeout(commit, SETTLE_MS);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };
    const settleNow = () => {
      if (raf) cancelAnimationFrame(raf);
      evaluate();
      commit();
    };
    const onResize = () => {
      const w = window.innerWidth;
      const vh = document.documentElement.clientHeight;
      // La barra de URL solo cambia `innerHeight`: no se recalcula nada.
      if (w === lastW && vh === lastVh) return;
      lastW = w;
      lastVh = vh;
      measureLine();
      schedule();
    };
    // Al salir el foco de la lista, el spy vuelve a decidir de inmediato
    // (si no, quedaría el reposo que deja el blur de la tarjeta).
    const onFocusOut = () => {
      current = UNKNOWN;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(settleNow);
    };

    measureLine();
    settleNow();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("scrollend", settleNow);
    window.addEventListener("resize", onResize);
    list.addEventListener("focusout", onFocusOut);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("scrollend", settleNow);
      window.removeEventListener("resize", onResize);
      list.removeEventListener("focusout", onFocusOut);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      // Al pasar a PC (o desmontar) no se queda un escenario pegado.
      if (current !== null) onChangeRef.current(null);
    };
  }, [enabled, stageRef, listRef, layoutKey]);
}
