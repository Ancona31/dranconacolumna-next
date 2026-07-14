"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/types";
import { getAlternatePath } from "@/lib/i18n/slug-map";

const OPTIONS: ReadonlyArray<{ code: Locale; label: string }> = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

/**
 * Selector de idioma ES ⇄ EN. El idioma actual queda marcado; el otro es un
 * enlace a la ruta equivalente (o al home del otro idioma si aún no existe
 * equivalente). `locale` es el idioma de la página que lo renderiza.
 */
export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? (locale === "es" ? "/" : "/en");
  const alternateHref = getAlternatePath(pathname, locale);

  return (
    <div
      className="flex items-center rounded-full border border-ink/15 p-0.5 font-body text-xs font-semibold"
      role="group"
      aria-label="Idioma / Language"
    >
      {OPTIONS.map((option) => {
        const active = option.code === locale;
        return active ? (
          <span
            key={option.code}
            aria-current="true"
            className="rounded-full bg-primary px-2.5 py-1 text-white"
          >
            {option.label}
          </span>
        ) : (
          <Link
            key={option.code}
            href={alternateHref}
            hrefLang={option.code}
            className="rounded-full px-2.5 py-1 text-ink/70 transition-colors hover:text-accent"
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
