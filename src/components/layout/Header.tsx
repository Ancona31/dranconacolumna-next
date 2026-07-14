"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import type { UiStrings } from "@/lib/i18n/types";

function Logo({ alt, tagline }: { alt: string; tagline: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt={alt}
        width={527}
        height={512}
        priority
        className="h-10 w-auto md:h-11"
      />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-bold text-primary">
          Dr. Angel Ancona
        </span>
        <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink/70">
          {tagline}
        </span>
      </span>
    </Link>
  );
}

export default function Header({ strings }: { strings: UiStrings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Drawer: `mounted` = presente en el DOM; `entered` = en posición abierta.
  // El cierre no desmonta de golpe: se dispara la salida y se desmonta al
  // terminar la transición (onTransitionEnd) con fallback de setTimeout.
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  const whatsappLink = buildWhatsAppLink(strings.whatsappDefaultMessage);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tras montar, en el siguiente frame pasamos a estado "abierto" para que la
  // transición de entrada se anime desde la posición cerrada.
  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  // Bloquea el scroll del body mientras el drawer esté presente.
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  function openDrawer() {
    setMounted(true);
  }

  function closeDrawer() {
    setEntered(false);
    // Fallback por si onTransitionEnd no dispara (misma duración que la salida).
    window.setTimeout(() => setMounted(false), 250);
  }

  function toggleDrawer() {
    if (mounted) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-[60] border-b border-ink/10 bg-background transition-shadow duration-200 ${
          scrolled ? "shadow-sm" : "shadow-none"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo alt={strings.header.logoAlt} tagline={strings.tagline} />

          {/* Navegación de escritorio */}
          <nav className="hidden items-center gap-6 md:flex">
            {strings.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link font-body text-sm font-medium transition-colors duration-150 ${
                    active ? "text-accent" : "text-ink hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("click_whatsapp", { origen: "header" })}
              className="rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
            >
              {strings.header.whatsappLabel}
            </a>
          </nav>

          {/* Acciones móviles */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("click_whatsapp", { origen: "header" })}
              className="rounded-full bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
            >
              {strings.header.whatsappLabel}
            </a>
            <button
              type="button"
              aria-label={mounted ? strings.header.closeMenu : strings.header.openMenu}
              aria-expanded={mounted}
              onClick={toggleDrawer}
              className="relative flex h-9 w-9 items-center justify-center rounded-md border border-ink/15 text-ink"
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
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className={`absolute inset-0 bg-ink/40 transition-opacity duration-200 ${
              entered ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={strings.header.menuLabel}
            onTransitionEnd={(e) => {
              if (e.propertyName === "transform" && !entered) {
                setMounted(false);
              }
            }}
            className={`absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-background pt-16 shadow-xl transition-transform ${
              entered
                ? "translate-x-0 duration-[250ms] ease-out"
                : "translate-x-full duration-200 ease-in"
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
                onClick={() => {
                  trackEvent("click_whatsapp", { origen: "header" });
                  closeDrawer();
                }}
                className="mt-4 rounded-full bg-whatsapp px-4 py-3 text-center text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                {strings.header.whatsappLabel}
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
