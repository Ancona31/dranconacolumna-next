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
import { SEDES } from "@/lib/sedes";

// Atribución exigida por la licencia CC BY-SA 2.1 JP del modelo del esqueleto
// 3D: fuente, enlace al texto de la licencia e indicación de cambios.
const BODYPARTS3D_URL =
  "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html";
const LICENSE_URL = "https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en";
const LICENSE_NAME = "CC BY-SA 2.1 JP";

// py-1 en enlaces en línea: el área táctil llega a ≥24 px sin mover el texto.
const creditLink =
  "py-1 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white/80";

const columnHeading = "font-heading text-sm font-semibold text-white";

export default function Footer({ strings }: { strings: UiStrings }) {
  const f = strings.footer;
  const [emailUser, emailDomain] = CONTACT_EMAIL.split("@");

  return (
    // Azul más profundo que primary y un filete claro arriba: el footer ya no
    // se funde con el bloque CTA azul con el que terminan casi todas las
    // páginas.
    <footer className="border-t border-white/10 bg-primary-deep text-white/90">
      {/* Zona segura: con muesca en horizontal, el contenido se alinea con el
          header en vez de quedar bajo la muesca. */}
      <div className="mx-auto max-w-6xl pb-8 pt-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] md:pt-14">
        {/* Una columna en móvil; en md+ tres: marca y credenciales ·
            navegación · contacto y sedes. En tablet las dos últimas toman su
            ancho natural (el correo cabe entero) y la marca cede el resto. */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-12">
          <div className="font-body text-sm text-white/80">
            <span className="inline-flex rounded-full bg-[var(--color-background)] p-1.5">
              <Image
                src="/logo.png"
                alt={f.logoAlt}
                width={527}
                height={512}
                className="h-12 w-auto"
              />
            </span>
            <p className="mt-4 font-heading text-base font-semibold text-white">
              {DOCTOR_FULL_NAME}
            </p>
            {/* Cada cédula se mantiene entera al partir el renglón. */}
            <p className="mt-1">
              <span className="whitespace-nowrap">
                {f.cedulaProf} {CEDULA_PROFESIONAL}
              </span>{" "}
              ·{" "}
              <span className="whitespace-nowrap">
                {f.cedulaEsp} {CEDULA_ESPECIALIDAD}
              </span>
            </p>
            <p className="mt-1 max-w-sm">{CERTIFICACION}</p>
          </div>

          <nav aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className={columnHeading}>
              {f.navHeading}
            </h2>
            <ul className="mt-2 flex flex-col">
              {strings.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center font-body text-sm text-white/90 transition-colors hover:text-white md:min-h-9"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="font-body text-sm">
            <h2 className={columnHeading}>{f.contactHeading}</h2>
            {/* Con zoom al 200 % el correo parte tras la @ (<wbr>) y, si aún
                no cabe, donde haga falta (overflow-wrap:anywhere) en vez de
                ensanchar la página. */}
            <p className="mt-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block py-1 text-white/90 underline underline-offset-4 transition-colors [overflow-wrap:anywhere] hover:text-white"
              >
                {emailUser}@
                <wbr />
                {emailDomain}
              </a>
            </p>
            <ul className="mt-4 space-y-3">
              {SEDES.map((sede) => (
                <li key={sede.id} className="leading-snug">
                  <span className="block font-semibold text-white">
                    {sede.nombre}
                  </span>
                  <span className="block text-white/70">{sede.ciudad}</span>
                </li>
              ))}
            </ul>
            <Link
              href={f.contactHref}
              className="mt-3 inline-flex min-h-11 items-center gap-1 font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white/80 md:min-h-9"
            >
              {f.locationsLinkLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Franja legal: aviso, descargo y crédito del modelo 3D. Todo a la
            izquierda: a la derecha, al final de la página, se posa el botón
            flotante de WhatsApp. */}
        <div className="mt-10 border-t border-white/15 pt-6 font-body text-sm">
          <Link
            href={f.privacyHref}
            className="inline-flex min-h-6 items-center text-white/90 underline underline-offset-4 transition-colors hover:text-white"
          >
            {f.privacyLabel}
          </Link>
          <div className="mt-2 space-y-2 md:max-w-2xl">
            <p className="italic text-white/70">{f.disclaimer}</p>
            {/* 13 px y blanco al 70 % (≥6.5:1): legible para el público de
                40–70 años sin competir con el aviso legal. ↗ visible + aviso
                sr-only para los enlaces que abren pestaña nueva. */}
            <p className="text-[13px] leading-6 text-white/70">
              {f.modelCreditLead}{" "}
              <a
                href={BODYPARTS3D_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={creditLink}
              >
                {f.modelCreditSource}
                <span aria-hidden="true"> ↗</span>
                <span className="sr-only"> {f.opensInNewTab}</span>
              </a>{" "}
              {f.modelCreditModified}, {f.modelCreditLicenseLead}{" "}
              <a
                href={LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer license"
                className={creditLink}
              >
                {LICENSE_NAME}
                <span aria-hidden="true"> ↗</span>
                <span className="sr-only"> {f.opensInNewTab}</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
