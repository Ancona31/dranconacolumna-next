"use client";

import { useEffect, useRef, useState } from "react";

/** Paso del escalonado entre hermanos que entran juntos, y su tope: un grid
 *  largo no debe arrastrarse. */
const STAGGER_MS = 80;
const MAX_DELAY_MS = 240;

/**
 * Margen inferior negativo: el elemento entra cuando su borde superior cruza
 * el 90 % del viewport. Con threshold 0.15 un bloque alto quedaba como hueco
 * vacío ~100 px antes de aparecer; así se anima apenas asoma.
 */
const ROOT_MARGIN = "0px 0px -10% 0px";

type Phase = "static" | "pending" | "in";

type Handlers = {
  /** Ya se leyó la posición inicial (al montar). */
  measured: boolean;
  setPhase: (phase: Phase, delay?: number) => void;
};

// Un solo IntersectionObserver para todos los Reveal: así los que entran en el
// mismo frame llegan en el mismo lote y se pueden escalonar por lista.
const registry = new Map<Element, Handlers>();
let sharedObserver: IntersectionObserver | null = null;

function release(el: Element) {
  registry.delete(el);
  sharedObserver?.unobserve(el);
}

function onEntries(entries: IntersectionObserverEntry[]) {
  const entering: Element[] = [];

  for (const entry of entries) {
    const handlers = registry.get(entry.target);
    if (!handlers) continue;

    if (!handlers.measured) {
      handlers.measured = true;
      // Ya visible (o por encima, p. ej. al volver con Atrás) al montar: se
      // queda como está, sin animación. Se mide contra el viewport completo,
      // no contra el margen: algo que ya asoma abajo no debe desaparecer.
      if (entry.boundingClientRect.top < window.innerHeight) {
        release(entry.target);
        continue;
      }
      // Debajo del pliegue: se oculta sin transición (nadie lo ve) y espera.
      handlers.setPhase("pending");
      continue;
    }

    if (entry.isIntersecting) entering.push(entry.target);
  }

  if (entering.length === 0) return;

  // Escalonado por lista, no por índice global: cuenta solo entre hermanos
  // (mismo padre) que entran en este lote, en orden del documento. Un
  // elemento que entra solo no espera.
  entering.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
  const perParent = new Map<Element | null, number>();
  for (const el of entering) {
    const index = perParent.get(el.parentElement) ?? 0;
    perParent.set(el.parentElement, index + 1);
    registry
      .get(el)
      ?.setPhase("in", Math.min(index * STAGGER_MS, MAX_DELAY_MS));
    release(el);
  }
}

function observe(el: Element, handlers: Handlers) {
  sharedObserver ??= new IntersectionObserver(onEntries, {
    rootMargin: ROOT_MARGIN,
  });
  registry.set(el, handlers);
  sharedObserver.observe(el);
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * @deprecated Se ignora. El escalonado ahora se calcula solo entre los
   * hermanos que entran juntos al viewport; se puede quitar de las llamadas.
   */
  delay?: number;
};

/**
 * Entrada sutil al hacer scroll, una sola vez.
 *
 * El contenido es visible por defecto: el HTML del servidor no trae ningún
 * estado oculto, así que con red lenta, JS que tarda o JS que falla todo se
 * lee desde el primer paint. Al hidratar, solo lo que quedó debajo del
 * pliegue se oculta (sin transición) para entrar al asomar; lo que ya estaba
 * a la vista se queda quieto. Los estilos viven en globals.css
 * (.reveal-pending / .reveal-in).
 *
 * No usar en texto clínico (alarmas, descargos, indicaciones): eso no debe
 * depender de una animación para verse.
 */
export default function Reveal({ children, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhaseState] = useState<Phase>("static");
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    observe(el, {
      measured: false,
      setPhase: (next, nextDelay = 0) => {
        setDelay(nextDelay);
        setPhaseState(next);
      },
    });
    return () => release(el);
  }, []);

  const phaseClass =
    phase === "pending"
      ? " reveal-pending"
      : phase === "in"
        ? " reveal-pending reveal-in"
        : "";

  return (
    <div
      ref={ref}
      className={`${className}${phaseClass}`.trim() || undefined}
      style={
        phase === "in" && delay
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
