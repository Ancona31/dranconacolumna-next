import Link from "next/link";
import Image from "next/image";
import { MAIN_NAV } from "@/lib/nav";
import {
  DOCTOR_FULL_NAME,
  CEDULA_PROFESIONAL,
  CEDULA_ESPECIALIDAD,
  CERTIFICACION,
} from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-primary text-white/90">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav className="flex flex-wrap gap-x-6 gap-y-3">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm text-white/90 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="font-body text-sm text-white/90 transition-colors hover:text-white"
          >
            Contacto
          </Link>
        </nav>

        <div className="mt-8 space-y-1 border-t border-white/15 pt-8 font-body text-sm text-white/80">
          <span className="mb-3 inline-flex rounded-full bg-[var(--color-background)] p-1.5">
            <Image
              src="/logo.png"
              alt="Logotipo Dr. Angel Ancona — columna vertebral"
              width={527}
              height={512}
              className="h-12 w-auto"
            />
          </span>
          <p className="font-semibold text-white">{DOCTOR_FULL_NAME}</p>
          <p>Cédula profesional: {CEDULA_PROFESIONAL}</p>
          <p>Cédula de especialidad: {CEDULA_ESPECIALIDAD}</p>
          <p>{CERTIFICACION}</p>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-sm">
          <Link
            href="/aviso-de-privacidad"
            className="text-white/90 underline underline-offset-4 transition-colors hover:text-white"
          >
            Aviso de privacidad
          </Link>
          <p className="italic text-white/70">
            Las evaluaciones de este sitio son orientativas y no sustituyen una
            consulta médica.
          </p>
        </div>
      </div>
    </footer>
  );
}
