import Link from "next/link";
import Image from "next/image";
import type { UiStrings } from "@/lib/i18n/types";
import {
  DOCTOR_FULL_NAME,
  CEDULA_PROFESIONAL,
  CEDULA_ESPECIALIDAD,
  CERTIFICACION,
  CONTACT_EMAIL,
} from "@/lib/config";

export default function Footer({ strings }: { strings: UiStrings }) {
  return (
    <footer className="bg-primary text-white/90">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav className="flex flex-wrap gap-x-6 gap-y-3">
          {strings.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm text-white/90 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 space-y-1 border-t border-white/15 pt-8 font-body text-sm text-white/80">
          <span className="mb-3 inline-flex rounded-full bg-[var(--color-background)] p-1.5">
            <Image
              src="/logo.png"
              alt={strings.footer.logoAlt}
              width={527}
              height={512}
              className="h-12 w-auto"
            />
          </span>
          <p className="font-semibold text-white">{DOCTOR_FULL_NAME}</p>
          <p>
            {strings.footer.cedulaProf} {CEDULA_PROFESIONAL} ·{" "}
            {strings.footer.cedulaEsp} {CEDULA_ESPECIALIDAD}
          </p>
          <p>{CERTIFICACION}</p>
          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-4 transition-colors hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-sm">
          <Link
            href={strings.footer.privacyHref}
            className="text-white/90 underline underline-offset-4 transition-colors hover:text-white"
          >
            {strings.footer.privacyLabel}
          </Link>
          <p className="italic text-white/70">{strings.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
