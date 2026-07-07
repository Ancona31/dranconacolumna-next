"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MAIN_NAV, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/nav";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { TAGLINE } from "@/lib/config";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Logotipo Dr. Angel Ancona — columna vertebral"
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
          {TAGLINE}
        </span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const whatsappLink = buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-ink/10 bg-background transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />

        {/* Navegación de escritorio */}
        <nav className="hidden items-center gap-6 md:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            WhatsApp
          </a>
        </nav>

        {/* Acciones móviles */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white"
          >
            WhatsApp
          </a>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-ink/15 text-ink"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
            </span>
          </button>
        </div>
      </div>

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <Logo />
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-ink/15 text-lg text-ink"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <nav className="flex flex-col p-4">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-ink/5 py-3 font-body text-base font-medium text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-whatsapp px-4 py-3 text-center text-sm font-semibold text-white"
              >
                WhatsApp
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
