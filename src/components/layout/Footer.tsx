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

// Atribución exigida por la licencia CC BY-SA 2.1 JP del modelo del esqueleto
// 3D: fuente, enlace al texto de la licencia e indicación de cambios.
const BODYPARTS3D_URL =
  "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html";
const LICENSE_URL = "https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en";
const LICENSE_NAME = "CC BY-SA 2.1 JP";

const creditLink =
  "underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white/80";

export default function Footer({ strings }: { strings: UiStrings }) {
  return (
    <footer className="bg-primary text-white/90">
      {/* Zona segura: con muesca en horizontal, el contenido se alinea con el
          header en vez de quedar bajo la muesca. */}
      <div className="mx-auto max-w-6xl py-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        <nav className="flex flex-wrap gap-x-6 gap-y-1">
          {strings.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center font-body text-sm text-white/90 transition-colors hover:text-white"
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
          {/* 13 px y blanco al 70 % (6.5:1): legible para el público de 40–70
              años sin competir con el aviso legal. ↗ visible + aviso sr-only
              para los enlaces que abren pestaña nueva. */}
          <p className="text-[13px] leading-5 text-white/70">
            {strings.footer.modelCreditLead}{" "}
            <a
              href={BODYPARTS3D_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={creditLink}
            >
              {strings.footer.modelCreditSource}
              <span aria-hidden="true"> ↗</span>
              <span className="sr-only"> {strings.footer.opensInNewTab}</span>
            </a>{" "}
            {strings.footer.modelCreditModified},{" "}
            {strings.footer.modelCreditLicenseLead}{" "}
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer license"
              className={creditLink}
            >
              {LICENSE_NAME}
              <span aria-hidden="true"> ↗</span>
              <span className="sr-only"> {strings.footer.opensInNewTab}</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
