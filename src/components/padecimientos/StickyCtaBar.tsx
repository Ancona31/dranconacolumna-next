"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { openWhatsAppInApp } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

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

    // Histéresis: aparece al pasar del 40 % y se oculta al bajar del 35 %,
    // para que no parpadee si el lector se detiene justo en el umbral.
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? doc.scrollTop / max : 0;
      setVisible((prev) => (prev ? pct > 0.35 : pct > 0.4));
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

  // Marca el documento mientras la barra está visible: el botón flotante de
  // WhatsApp (.wa-float) sube para no taparle su propio botón.
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-cta-bar", visible);
    return () => root.removeAttribute("data-cta-bar");
  }, [visible]);

  return (
    <div
      // inert cuando está oculta: la saca del orden de tabulación y de los
      // lectores de pantalla mientras está fuera de vista.
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 hidden border-t border-ink/10 bg-background shadow-overlay md:block ${
        animate ? "transition-transform ease-drawer" : ""
      } ${visible ? "translate-y-0 duration-300" : "translate-y-full duration-200"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <p className="font-body text-sm text-ink/80">
          <span className="font-semibold text-primary">{nombre}</span>
          <span aria-hidden="true"> · </span>
          {reminderText}
        </p>
        <div className="flex flex-none items-center gap-3">
          <Link
            href={evaluacionHref}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
          >
            {testCtaLabel}
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              trackEvent("whatsapp_click", {
                source_section: "padecimientos_barra",
              });
              if (openWhatsAppInApp(whatsappLink)) e.preventDefault();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 px-5 py-2.5 font-body text-sm font-semibold text-primary transition-[transform,background-color] duration-150 ease-out hover:bg-primary-soft active:scale-[0.97]"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp-strong" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
