"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/types";
import { getAlternatePath } from "@/lib/i18n/slug-map";
import FlagMX from "@/components/ui/FlagMX";
import FlagUS from "@/components/ui/FlagUS";

type Option = {
  code: Locale;
  /** Nombre del idioma en su propio idioma (para el desplegable). */
  label: string;
  /** Código corto para el botón (ES / EN). */
  short: string;
  Flag: ComponentType<{ className?: string }>;
};

const OPTIONS: Option[] = [
  { code: "es", label: "Español", short: "ES", Flag: FlagMX },
  { code: "en", label: "English", short: "EN", Flag: FlagUS },
];

/** Bandera a ~20×14 px con esquinas redondeadas y borde sutil (que la franja
 *  blanca no se pierda sobre fondo claro). */
const FLAG_CLASS = "h-[14px] w-[20px] shrink-0 rounded-[2px] ring-1 ring-black/10";

/**
 * Selector de idioma estilo desplegable (bandera + código en el botón; bandera
 * + nombre completo + check en las opciones). El idioma actual queda marcado;
 * el otro enlaza a la ruta equivalente (o al home del otro idioma si aún no hay
 * equivalente). Mismo componente en móvil y escritorio. `locale` es el idioma
 * de la página que lo renderiza.
 */
export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? (locale === "es" ? "/" : "/en");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[0];
  // Ruta de cada opción: la actual se queda en su sitio; la otra usa el mapa.
  const hrefFor = (code: Locale) =>
    code === locale ? pathname : getAlternatePath(pathname, locale);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Idioma / Language: ${current.label}`}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-ink/15 px-2.5 font-body text-xs font-semibold text-ink transition-colors hover:border-accent"
      >
        <current.Flag className={FLAG_CLASS} />
        <span>{current.short}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-ink/60 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Idioma / Language"
          className="absolute right-0 top-full z-[70] mt-2 min-w-[168px] overflow-hidden rounded-xl border border-ink/10 bg-background py-1 shadow-lg"
        >
          {OPTIONS.map((o) => {
            const active = o.code === locale;
            return (
              <Link
                key={o.code}
                href={hrefFor(o.code)}
                hrefLang={o.code}
                role="menuitem"
                aria-current={active ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-[44px] items-center gap-2.5 px-3 font-body text-sm transition-colors ${
                  active
                    ? "bg-primary/5 font-semibold text-primary"
                    : "text-ink hover:bg-ink/5"
                }`}
              >
                <o.Flag className={FLAG_CLASS} />
                <span className="flex-1">{o.label}</span>
                {active && (
                  <Check
                    className="h-4 w-4 shrink-0 text-accent"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
