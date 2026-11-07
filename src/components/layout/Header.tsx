"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { buildWhatsAppLink, openWhatsAppInApp } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import type { Locale, UiStrings } from "@/lib/i18n/types";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buttonClasses } from "@/components/ui/Button";
import { useLazyComponent } from "@/components/ui/useLazyComponent";

// El panel del menú móvil (Base UI Dialog) se carga bajo demanda: la
// hamburguesa se renderiza en el servidor y el panel se pide al primer gesto
// sobre ella (hover, foco o toque), así la librería no pesa en la carga
// inicial de cada página.
const loadDrawer = () => import("@/components/layout/MobileDrawer");

function Logo({
  alt,
  tagline,
}: {
  alt: string;
  tagline: { line1: string; line2: string };
}) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2 min-[400px]:gap-2.5">
      <Image
        src="/logo.png"
        alt={alt}
        width={527}
        height={512}
        priority
        className="h-9 w-auto shrink-0 min-[400px]:h-10 lg:h-11"
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="truncate font-heading text-base font-bold text-primary min-[400px]:text-lg lg:text-base xl:text-lg">
          Dr. Angel Ancona
        </span>
        {/* La bajada se oculta en móvil para que el header quepa en una sola
            línea junto al chip de idioma; reaparece desde sm. Entre lg y xl
            se oculta otra vez: ahí entra el nav de escritorio y a 1024px no
            caben logo con bajada, 5 enlaces, idioma y WhatsApp. Dos renglones,
            cada uno sin envolver: el bloque crece en alto pero ocupa menos
            ancho que la antigua línea única. */}
        <span className="mt-0.5 hidden flex-col leading-tight sm:flex lg:hidden xl:flex">
          <span className="whitespace-nowrap font-body text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink/70">
            {tagline.line1}
          </span>
          <span className="whitespace-nowrap font-body text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink/70">
            {tagline.line2}
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function Header({
  locale,
  strings,
}: {
  locale: Locale;
  strings: UiStrings;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Drawer: `open` lo controla el Header; el panel (MobileDrawer) se monta la
  // primera vez que hace falta (`drawerWanted`) y ya no se desmonta, para que
  // sus salidas sigan animándose. `instantClose` apaga la transición del
  // cierre por cambio de ruta (ver abajo).
  const [open, setOpen] = useState(false);
  const [drawerWanted, setDrawerWanted] = useState(false);
  const [instantClose, setInstantClose] = useState(false);
  const [openedByKeyboard, setOpenedByKeyboard] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [MobileDrawer, requestDrawer] = useLazyComponent(loadDrawer);

  const whatsappLink = buildWhatsAppLink(strings.whatsappDefaultMessage);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDrawer = useCallback(() => setOpen(false), []);

  // Intención de abrir (hover, foco, toque): se pide el código del panel
  // para que al hacer clic ya esté listo. Si el clic llega antes, el panel se
  // abre en cuanto el código llega.
  const prefetchDrawer = requestDrawer;

  function toggleDrawer(e: React.MouseEvent<HTMLButtonElement>) {
    if (open) {
      closeDrawer();
      return;
    }
    // detail === 0: el clic lo generó Enter/Espacio, no un puntero.
    setOpenedByKeyboard(e.detail === 0);
    setInstantClose(false);
    setDrawerWanted(true);
    setOpen(true);
    requestDrawer();
  }

  // Cambio de ruta con el drawer aún abierto (Atrás/Adelante del navegador,
  // o una navegación que no pasó por sus enlaces): se cierra en el render
  // mismo y sin animación, para que la página nueva no llegue tapada ni con
  // el scroll bloqueado. Los enlaces del drawer ya cierran al tocarlos (open
  // pasa a false antes del cambio de ruta) y conservan su salida animada.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) {
      setOpen(false);
      setInstantClose(true);
    }
  }

  // Atrás del sistema con el menú abierto: se cierra ya (popstate llega
  // antes que el nuevo pathname), con su salida normal.
  useEffect(() => {
    if (!open) return;
    const onPopState = () => closeDrawer();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [open, closeDrawer]);

  // El drawer solo existe por debajo de lg: si la ventana crece hasta lg con
  // él abierto, se cierra (si no, quedaría invisible con el scroll bloqueado).
  useEffect(() => {
    if (!open) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (wide.matches) closeDrawer();
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, [open, closeDrawer]);

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      {/* Material translúcido: el contenido pasa por debajo desenfocado. El
          borde y la sombra solo aparecen al hacer scroll. Con
          prefers-reduced-transparency el fondo vuelve a ser sólido. */}
      <header
        className={`sticky top-0 z-[60] border-b bg-background/80 backdrop-blur-md backdrop-saturate-150 transition-[border-color,box-shadow] duration-200 ease-out [@media(prefers-reduced-transparency:reduce)]:bg-background ${
          scrolled
            ? "border-ink/10 shadow-card"
            : "border-transparent shadow-none"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
          <Logo alt={strings.header.logoAlt} tagline={strings.tagline} />

          {/* Navegación de escritorio. gap reducido (antes gap-6) y cada enlace
              en una sola línea (whitespace-nowrap) para que los 5 items quepan
              sin envolver junto al selector y WhatsApp; el ancho lo cede el
              tagline, ahora en dos renglones más estrechos. */}
          <nav className="hidden items-center gap-3 lg:flex xl:gap-4">
            {strings.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link whitespace-nowrap py-1 font-body text-sm font-medium transition-colors duration-150 ease-out ${
                    active ? "text-accent" : "text-ink hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <LanguageSwitcher locale={locale} />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                trackEvent("whatsapp_click", { source_section: "header" });
                if (openWhatsAppInApp(whatsappLink)) e.preventDefault();
              }}
              className={buttonClasses({
                variant: "whatsapp",
                size: "sm",
                className: "whitespace-nowrap",
              })}
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp" />
              {strings.header.whatsappLabel}
            </a>
          </nav>

          {/* Acciones móviles. El chip de idioma es SIEMPRE visible en la barra
              (no dentro del drawer). El botón de WhatsApp del top bar se retira
              en móvil para dar espacio: sigue disponible en la barra inferior
              fija (MobileActionBar) y en el drawer. */}
          <div className="flex shrink-0 items-center gap-1.5 min-[400px]:gap-2 lg:hidden">
            <LanguageSwitcher locale={locale} />
            {/* La hamburguesa queda por encima del fondo del drawer (el header
                va en z-[60]): con puntero también lo cierra. Con teclado y
                lector de pantalla se cierra con Escape o con el botón
                "Cerrar" del final del panel. */}
            <button
              ref={toggleRef}
              type="button"
              aria-label={
                open ? strings.header.closeMenu : strings.header.openMenu
              }
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={toggleDrawer}
              onPointerEnter={prefetchDrawer}
              onPointerDown={prefetchDrawer}
              onFocus={prefetchDrawer}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-[transform,background-color,color,opacity] duration-150 ease-out active:scale-[0.97]"
            >
              {/* Ícono hamburguesa ⇄ X: rotación + fade cruzado */}
              <Menu
                className={`absolute h-5 w-5 transition-[transform,opacity] duration-200 ease-out ${
                  open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <X
                className={`absolute h-5 w-5 transition-[transform,opacity] duration-200 ease-out ${
                  open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </header>

      {drawerWanted && MobileDrawer && (
        <MobileDrawer
          open={open}
          onOpenChange={setOpen}
          instantClose={instantClose}
          onCloseComplete={() => setInstantClose(false)}
          openedByKeyboard={openedByKeyboard}
          toggleRef={toggleRef}
          strings={strings}
          whatsappLink={whatsappLink}
        />
      )}
    </>
  );
}
