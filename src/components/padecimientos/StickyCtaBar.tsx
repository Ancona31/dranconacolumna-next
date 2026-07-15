"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type StickyCtaBarProps = {
  nombre: string;
  testCtaLabel: string;
  evaluacionHref: string;
  whatsappLink: string;
  /** Recordatorio junto al nombre, ya traducido por locale. */
  reminderText: string;
};

/**
 * Barra recordatoria del embudo, solo en desktop. Aparece cuando el lector ya
 * recorrió más del 40 % de la página — señal de interés — y reofrece el test y
 * el WhatsApp sin que tenga que volver arriba. En móvil este papel lo cumple
 * el MobileActionBar, así que aquí queda oculto.
 */
export default function StickyCtaBar({
  nombre,
  testCtaLabel,
  evaluacionHref,
  whatsappLink,
  reminderText,
}: StickyCtaBarProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setAnimate(!reduced.matches);
    syncMotion();
    reduced.addEventListener("change", syncMotion);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? doc.scrollTop / max : 0;
      setVisible(pct > 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      reduced.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      // inert cuando está oculta: la saca del orden de tabulación y de los
      // lectores de pantalla mientras está fuera de vista.
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 hidden border-t border-ink/10 bg-background shadow-[0_-4px_20px_rgba(11,60,93,0.08)] md:block ${
        animate ? "transition-transform duration-300 ease-out" : ""
      } ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
        <p className="font-body text-sm text-ink/80">
          <span className="font-semibold text-primary">{nombre}</span>
          <span aria-hidden="true"> · </span>
          {reminderText}
        </p>
        <div className="flex flex-none items-center gap-3">
          <Link
            href={evaluacionHref}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
          >
            {testCtaLabel}
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("click_whatsapp", { origen: "padecimiento_barra" })
            }
            className="inline-flex items-center justify-center rounded-full bg-whatsapp px-5 py-2.5 font-body text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
