"use client";

import { useEffect, useRef, useState } from "react";

const MAX_DELAY_MS = 240;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Retraso de entrada en milisegundos (para escalonar grids). Solo aplica
   *  en md+ y se limita a 240ms para que un grid largo no se arrastre. */
  delay?: number;
};

/**
 * Envuelve contenido y lo revela una sola vez al entrar al viewport.
 * El estilo de entrada vive en globals.css (.reveal / .revealed); aquí solo
 * se alterna la clase. Sin JS o con prefers-reduced-motion, todo queda visible.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${revealed ? " revealed" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={
        delay
          ? ({
              "--reveal-delay": `${Math.min(delay, MAX_DELAY_MS)}ms`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
