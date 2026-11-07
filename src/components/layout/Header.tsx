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

  // Drawer: `mounted` = presente en el DOM; `entered` = en posición abierta.
  // El cierre no desmonta de golpe: se dispara la salida y se desmonta al
  // terminar la transición (onTransitionEnd) con fallback de setTimeout. Abrir
  // durante la salida cancela ese fallback y la transición CSS retoma desde la
  // posición actual (interrumpible).
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const unmountTimer = useRef<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const whatsappLink = buildWhatsAppLink(strings.whatsappDefaultMessage);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // `fromKeyboard`: con teclado el foco va al primer enlace (con su anillo);
  // al tocar va al panel mismo, que no dibuja anillo (en iPhone el foco
  // programático tras un toque pintaba el anillo en el primer enlace).
  const openDrawer = useCallback((fromKeyboard: boolean) => {
    if (unmountTimer.current !== null) {
      clearTimeout(unmountTimer.current);
      unmountTimer.current = null;
    }
    setMounted(true);
    // En el siguiente frame pasamos a "abierto" para que la entrada se anime
    // desde la posición cerrada; si ya estaba montado (salida en curso), la
    // transición se revierte desde donde va.
    requestAnimationFrame(() => {
      setEntered(true);
      const target = fromKeyboard
        ? drawerRef.current?.querySelector<HTMLElement>("a[href]")
        : drawerRef.current;
      target?.focus({ preventScroll: true });
    });
  }, []);

  const closeDrawer = useCallback(() => {
    setEntered(false);
    toggleRef.current?.focus({ preventScroll: true });
    // Fallback por si onTransitionEnd no dispara (algo más que la salida).
    if (unmountTimer.current !== null) clearTimeout(unmountTimer.current);
    unmountTimer.current = window.setTimeout(() => {
      unmountTimer.current = null;
      setMounted(false);
    }, 250);
  }, []);

  useEffect(
    () => () => {
      if (unmountTimer.current !== null) clearTimeout(unmountTimer.current);
    },
    [],
  );

  // Cambio de ruta con el drawer aún abierto (Atrás/Adelante del navegador,
  // o una navegación que no pasó por sus enlaces): se cierra en el render
  // mismo, sin animación, para que la página nueva no llegue tapada ni con el
  // scroll bloqueado. Los enlaces del drawer ya cierran al tocarlos (entered
  // pasa a false antes del cambio de ruta) y conservan su salida animada.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (entered) {
      setEntered(false);
      setMounted(false);
    }
  }

  // Atrás del sistema con el menú abierto: se cierra ya (popstate llega
  // antes que el nuevo pathname), con su salida normal.
  useEffect(() => {
    if (!entered) return;
    const onPopState = () => closeDrawer();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [entered, closeDrawer]);

  // Bloquea el scroll mientras el drawer esté abierto. Va en <html> y <body>:
  // iOS Safari ignora overflow:hidden si solo está en el body. No se fija el
  // body con position:fixed porque el header sticky se iría con él. Depende
  // de `entered` (no de `mounted`): se libera en cuanto empieza el cierre, así
  // que una navegación nunca encuentra el scroll bloqueado.
  useEffect(() => {
    if (!entered) return;
    const html = document.documentElement.style;
    const body = document.body.style;
    const previous = { html: html.overflow, body: body.overflow };
    html.overflow = "hidden";
    body.overflow = "hidden";
    return () => {
      html.overflow = previous.html;
      body.overflow = previous.body;
    };
  }, [entered]);

  // Con el drawer abierto: Escape cierra y Tab queda atrapado entre el botón
  // de cerrar (en el header) y los enlaces del drawer.
  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current || !toggleRef.current) return;
      const focusables = [
        toggleRef.current,
        ...drawerRef.current.querySelectorAll<HTMLElement>("a[href], button"),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      // Abierto al tocar, el foco está en el panel: Tab entra a sus enlaces.
      if (active === drawerRef.current) {
        e.preventDefault();
        (e.shiftKey ? last : (focusables[1] ?? first)).focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!focusables.includes(active as HTMLElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [entered, closeDrawer]);

  function toggleDrawer(e: React.MouseEvent<HTMLButtonElement>) {
    if (entered) {
      closeDrawer();
    } else {
      // detail === 0: el clic lo generó Enter/Espacio, no un puntero.
      openDrawer(e.detail === 0);
    }
  }

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
        className={`sticky top-0 z-[60] border-b bg-background/80 backdrop-blur-md backdrop-saturate-150 transition-[border-color,box-shadow] duration-200 [@media(prefers-reduced-transparency:reduce)]:bg-background ${
          scrolled
            ? "border-ink/10 shadow-sm"
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
                  className={`nav-link whitespace-nowrap py-1 font-body text-sm font-medium transition-colors duration-150 ${
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
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-[transform,background-color,color,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
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
            <button
              ref={toggleRef}
              type="button"
              aria-label={
                entered ? strings.header.closeMenu : strings.header.openMenu
              }
              aria-expanded={entered}
              onClick={toggleDrawer}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-[transform,background-color,color,opacity] duration-150 ease-out active:scale-[0.97]"
            >
              {/* Ícono hamburguesa ⇄ X: rotación + fade cruzado */}
              <Menu
                className={`absolute h-5 w-5 transition-[transform,opacity] duration-200 ${
                  entered ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <X
                className={`absolute h-5 w-5 transition-[transform,opacity] duration-200 ${
                  entered ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer móvil (bajo el header z-[60], que queda siempre accesible) */}
      {mounted && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className={`rm-fade absolute inset-0 bg-ink/40 transition-opacity ease-drawer ${
              entered ? "opacity-100 duration-300" : "opacity-0 duration-200"
            }`}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={strings.header.menuLabel}
            tabIndex={-1}
            // Con reducir movimiento el panel no se desliza: se funde
            // (.drawer-panel + .rm-fade en globals.css, guiado por data-open).
            data-open={entered ? "true" : "false"}
            onTransitionEnd={(e) => {
              // Tailwind 4 desliza con `translate`; con reducir movimiento
              // lo que termina es el fundido (`opacity`).
              if (
                e.target === e.currentTarget &&
                ["translate", "transform", "opacity"].includes(
                  e.propertyName,
                ) &&
                !entered
              ) {
                if (unmountTimer.current !== null) {
                  clearTimeout(unmountTimer.current);
                  unmountTimer.current = null;
                }
                setMounted(false);
              }
            }}
            // Misma curva de iOS en ambos sentidos: entra en 300ms y sale en
            // 200ms. ease-in en la salida hacía que el cierre se sintiera lento.
            className={`drawer-panel rm-fade absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col overflow-y-auto overscroll-contain bg-background pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pt-[4.5rem] shadow-overlay transition-transform ease-drawer ${
              entered
                ? "translate-x-0 duration-300"
                : "translate-x-full duration-200"
            }`}
          >
            <nav className="flex flex-col p-4">
              {strings.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  className="border-b border-ink/5 py-3 font-body text-base font-medium text-ink transition-colors duration-150 hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  trackEvent("whatsapp_click", { source_section: "header" });
                  if (openWhatsAppInApp(whatsappLink)) e.preventDefault();
                  closeDrawer();
                }}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-[transform,background-color,color,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp" />
                {strings.header.whatsappLabel}
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
