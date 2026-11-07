"use client";

import { useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/types";
import { getAlternatePath } from "@/lib/i18n/slug-map";
import FlagMX from "@/components/ui/FlagMX";
import FlagUS from "@/components/ui/FlagUS";
import { useLazyComponent } from "@/components/ui/useLazyComponent";

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

// El desplegable (Base UI Menu) se carga bajo demanda: el botón se renderiza
// en el servidor y el menú se pide al primer gesto sobre él.
const loadMenu = () => import("@/components/layout/LanguageMenu");

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
  // El menú se monta la primera vez que hace falta y ya no se desmonta (así
  // su salida se anima).
  const [wanted, setWanted] = useState(false);
  const [openedByKeyboard, setOpenedByKeyboard] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [LanguageMenu, requestMenu] = useLazyComponent(loadMenu);

  function show(byKeyboard: boolean) {
    setOpenedByKeyboard(byKeyboard);
    setWanted(true);
    setOpen(true);
    requestMenu();
  }

  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[0];
  // Ruta de cada opción: la actual se queda en su sitio; la otra usa el mapa.
  const hrefFor = (code: Locale) =>
    code === locale ? pathname : getAlternatePath(pathname, locale);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          // Con el menú abierto el fondo de la librería recibe el toque (y
          // cierra); aquí solo llega la apertura. detail === 0: el clic lo
          // generó el teclado, no un puntero.
          if (!open) show(e.detail === 0);
        }}
        onKeyDown={(e) => {
          // Patrón ARIA menu button: flecha abajo/arriba también abre.
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            show(true);
          }
        }}
        onPointerEnter={requestMenu}
        onPointerDown={requestMenu}
        onFocus={requestMenu}
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
          className={`hidden h-3.5 w-3.5 text-muted transition-transform duration-150 ease-out min-[400px]:block ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {wanted && LanguageMenu && (
        <LanguageMenu
          open={open}
          onOpenChange={setOpen}
          openedByKeyboard={openedByKeyboard}
          anchorRef={triggerRef}
          options={OPTIONS.map((o) => ({
            code: o.code,
            label: o.label,
            href: hrefFor(o.code),
            Flag: o.Flag,
          }))}
          current={locale}
          flagClass={FLAG_CLASS}
        />
      )}
    </>
  );
}
