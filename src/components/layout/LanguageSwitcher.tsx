"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
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
const FLAG_CLASS =
  "h-[14px] w-[20px] shrink-0 rounded-[2px] ring-1 ring-black/10";

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // Abierto con teclado (Enter/Espacio): el foco va a la primera opción. Con
  // toque o clic va al panel, que no dibuja anillo (en iPhone el foco
  // programático tras un toque lo pintaba sobre la opción).
  const openedByKeyboard = useRef(false);

  // Abierto: el foco pasa al menú; toque/clic fuera cierra
  // (pointerdown cubre ratón y táctil) y Escape cierra devolviendo el foco al
  // botón.
  useEffect(() => {
    if (!open) return;
    const target = openedByKeyboard.current
      ? menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')
      : menuRef.current;
    target?.focus({ preventScroll: true });
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Navegación del menú con flechas, Inicio y Fin (patrón ARIA menu). Tab
  // cierra y deja que el foco siga su curso.
  function onMenuKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "ArrowDown"
        ? (index + 1) % items.length
        : e.key === "ArrowUp"
          ? (index - 1 + items.length) % items.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? items.length - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    items[next].focus();
  }

  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[0];
  // Ruta de cada opción: la actual se queda en su sitio; la otra usa el mapa.
  const hrefFor = (code: Locale) =>
    code === locale ? pathname : getAlternatePath(pathname, locale);

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          // detail === 0: el clic lo generó el teclado, no un puntero.
          openedByKeyboard.current = e.detail === 0;
          setOpen((v) => !v);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Idioma / Language: ${current.label}`}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-ink/15 px-2 font-body min-[400px]:px-2.5 text-xs font-semibold text-ink transition-[transform,border-color,background-color,color] duration-150 ease-out hover:border-accent active:scale-[0.97]"
      >
        <current.Flag className={FLAG_CLASS} />
        {/* En teléfonos de 320px basta la bandera (el aria-label nombra el
            idioma); así el nombre del doctor cabe completo en el header. */}
        <span className="hidden min-[360px]:inline">{current.short}</span>
        {/* Sin chevron en teléfonos angostos: deja sitio al nombre del header. */}
        <ChevronDown
          className={`hidden h-3.5 w-3.5 text-muted transition-transform min-[400px]:block duration-150 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Idioma / Language"
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          className="popover-in absolute right-0 top-full z-[70] mt-2 min-w-[168px] origin-top-right overflow-hidden rounded-xl border border-ink/10 bg-background py-1 shadow-overlay"
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
