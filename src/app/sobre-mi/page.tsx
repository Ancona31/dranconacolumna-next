import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, BadgeCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import {
  DOCTOR_FULL_NAME,
  CEDULA_PROFESIONAL,
  CEDULA_ESPECIALIDAD,
} from "@/lib/config";

export const metadata: Metadata = {
  title: "Sobre mí — Ortopedista y Traumatólogo en Mérida",
  description:
    "Conoce al Dr. Angel M. Ancona Pérez: formación, certificaciones y su manera de tratar a cada paciente. Alta especialidad en cirugía de columna.",
};

const FORMACION = [
  "Médico Cirujano — Universidad Autónoma Metropolitana · Mención Honorífica",
  "Especialidad en Traumatología y Ortopedia — Centro Médico del Noroeste, Cd. Obregón, Sonora",
  "Alta Especialidad en Cirugía de Columna — Hospital de Traumatología y Ortopedia Lomas Verdes",
];

const CERTIFICACIONES = [
  "Certificado por el Consejo Mexicano de Ortopedia y Traumatología (CMOT) — Certificación 26/5567/25",
  "Miembro activo de la Asociación Mexicana de Cirujanos de Columna, A.C. (AMCICO)",
  "Miembro de la Asociación Mexicana de Cirugía Endoscópica Biportal (AMCEBiC)",
];

export default function SobreMiPage() {
  const whatsappLink = buildWhatsAppLink(
    "Hola Dr. Ancona, me gustaría agendar una valoración."
  );

  return (
    <>
      {/* Hero de página */}
      <section className="bg-primary-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <Reveal>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/dr-ancona-perfil.jpg"
                alt="Dr. Angel M. Ancona Pérez, ortopedista y traumatólogo"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Sobre mí
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
              {DOCTOR_FULL_NAME}
            </h1>
            <p className="mt-3 font-body text-lg text-ink/80">
              Ortopedista y traumatólogo · Alta especialidad en cirugía de
              columna
            </p>
            <p className="mt-5 font-body text-ink/75">
              Atiendo en Mérida y Umán todo el aparato musculoesquelético: desde
              una fractura o un esguince hasta la cirugía de columna más
              compleja. Mi consulta funciona con una regla simple: primero
              entender exactamente qué tienes, y después elegir juntos el
              tratamiento que de verdad necesitas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mi manera de trabajar */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Mi manera de trabajar
            </h2>
            <div className="mt-6 space-y-5 font-body text-ink/75">
              <p>
                La cirugía es la excepción, no la regla. La mayoría de los
                problemas de columna y de las lesiones ortopédicas mejoran con
                tratamiento conservador bien dirigido: medicamento, fisioterapia
                y ajustes de actividad. Si te digo que necesitas cirugía, es
                porque lo demás ya se agotó o porque esperar pone en riesgo tu
                función.
              </p>
              <p>
                Cuando operar es lo correcto, uso la técnica menos agresiva que
                tu caso permita. Mi alta especialidad me formó en cirugía de
                mínima invasión de columna: incisiones más pequeñas, menos daño
                muscular y recuperaciones más rápidas — siempre que el caso sea
                candidato.
              </p>
              <p>
                Y te atiendo yo, en cada etapa. La valoración, la cirugía si
                hace falta y cada revisión posterior. Mi WhatsApp lo respondo
                personalmente, porque una duda a tiempo evita complicaciones.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Formación */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Formación
            </h2>
            <ul className="mt-6 space-y-4">
              {FORMACION.map((item) => (
                <li key={item} className="flex gap-3">
                  <GraduationCap
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-body text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Certificaciones y membresías */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Certificaciones y membresías
            </h2>
            <ul className="mt-6 space-y-4">
              {CERTIFICACIONES.map((item) => (
                <li key={item} className="flex gap-3">
                  <BadgeCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-body text-ink/80">{item}</span>
                </li>
              ))}
              <li className="flex gap-3">
                <BadgeCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="font-body text-ink/80">
                  Cédula profesional {CEDULA_PROFESIONAL} · Cédula de
                  especialista {CEDULA_ESPECIALIDAD}
                </span>
              </li>
            </ul>
            <p className="mt-6 font-body text-sm text-ink/60">
              Más de 200 cirugías de columna realizadas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-white">
              ¿Hablamos de tu caso?
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-white/80">
              Haz una evaluación gratuita de tu dolor o escríbeme directamente.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/evaluacion"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 font-body text-base font-semibold text-primary transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                Hacer mi evaluación
              </Link>
              <WhatsAppLink
                href={whatsappLink}
                origen="sobre_mi"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                Escribir por WhatsApp
              </WhatsAppLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
