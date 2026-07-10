import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Check } from "lucide-react";
import Placeholder from "@/components/Placeholder";
import ButtonLink from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import {
  CEDULA_ESPECIALIDAD,
  CEDULA_PROFESIONAL,
  DOCTOR_FULL_NAME,
} from "@/lib/config";
import { getPadecimiento, type Padecimiento } from "@/lib/padecimientos";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Params = { slug: string };

const GRUPO_LABEL: Record<Padecimiento["grupo"], string> = {
  columna: "Columna",
  ortopedia: "Ortopedia y traumatología",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPadecimiento(slug);

  if (!p) return { title: `Padecimiento: ${slug}` };

  return {
    // absolute: el metaTitle ya trae la marca; evita duplicar el template.
    title: { absolute: p.metaTitle },
    description: p.metaDescription,
  };
}

function buildJsonLd(p: Padecimiento) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: p.metaTitle,
    description: p.metaDescription,
    inLanguage: "es-MX",
    about: {
      "@type": "MedicalCondition",
      name: p.nombre,
    },
    reviewedBy: {
      "@type": "Physician",
      name: DOCTOR_FULL_NAME,
      identifier: [
        {
          "@type": "PropertyValue",
          name: "Cédula profesional",
          value: CEDULA_PROFESIONAL,
        },
        {
          "@type": "PropertyValue",
          name: "Cédula de especialidad",
          value: CEDULA_ESPECIALIDAD,
        },
      ],
    },
  };
}

export default async function PadecimientoSlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = getPadecimiento(slug);

  if (!p) return <Placeholder title={slug} phase={3} />;

  const whatsappLink = buildWhatsAppLink(
    `Hola Dr. Ancona, leí sobre ${p.nombre} y quiero una valoración.`
  );
  // Sin zona (padecimientos paraguas) el test arranca en el mapa corporal.
  const evaluacionHref = p.testZone
    ? `/evaluacion?zona=${p.testZone}`
    : "/evaluacion";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(p)) }}
      />

      {/* Encabezado y definición */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              <Link href="/padecimientos" className="hover:underline">
                Padecimientos
              </Link>
              <span aria-hidden="true"> · </span>
              {GRUPO_LABEL[p.grupo]}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
              {p.nombre}
            </h1>
            <div className="mt-6 space-y-4">
              {p.definicion.map((parrafo) => (
                <p key={parrafo} className="font-body text-lg text-ink/80">
                  {parrafo}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Síntomas comunes */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Síntomas comunes
            </h2>
            <ul className="mt-6 space-y-4">
              {p.sintomas.map((sintoma) => (
                <li key={sintoma} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="font-body text-ink/75">{sintoma}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Señales de alarma */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 pb-14 md:pb-20">
          <Reveal>
            <div className="rounded-2xl border-l-4 border-danger bg-[#F9EAE8] p-6 md:p-8">
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className="h-6 w-6 flex-none text-danger"
                  strokeWidth={1.75}
                />
                <h2 className="font-heading text-2xl font-bold text-primary">
                  ¿Cuándo preocuparse?
                </h2>
              </div>

              {p.cuandoPreocuparse.intro && (
                <p className="mt-4 font-body text-ink/75">
                  {p.cuandoPreocuparse.intro}
                </p>
              )}

              <ul className="mt-4 space-y-3">
                {p.cuandoPreocuparse.señales.map((señal) => (
                  <li key={señal} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-danger"
                    />
                    <span className="font-body text-ink/80">{señal}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 font-body text-sm italic text-ink/70">
                Estas señales no deben esperar.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Opciones de tratamiento */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Opciones de tratamiento
            </h2>
          </Reveal>

          <ol className="mt-8 space-y-6">
            {p.tratamiento.map((paso, i) => (
              <Reveal key={paso.titulo} delay={i * 80}>
                <li className="flex gap-5 rounded-2xl border border-primary/10 bg-background p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary font-heading text-base font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-primary">
                      {paso.titulo}
                    </h3>
                    <p className="mt-2 font-body text-ink/75">{paso.texto}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Cómo lo trato yo */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <div className="rounded-2xl bg-primary-soft p-6 md:p-10">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Cómo lo trato yo
              </h2>
              <div className="mt-6 space-y-4">
                {p.comoLoTrato.map((parrafo) => (
                  <p key={parrafo} className="font-body text-ink/80">
                    {parrafo}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 pb-14 md:pb-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Preguntas frecuentes
            </h2>
          </Reveal>

          <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {p.faq.map((item, i) => (
              <Reveal key={item.pregunta} delay={i * 60}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-base font-semibold text-primary [&::-webkit-details-marker]:hidden">
                    {item.pregunta}
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex-none font-body text-xl leading-none text-accent transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 font-body text-ink/75">
                    {item.respuesta}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-white">
              ¿Este dolor te suena conocido?
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-white/80">
              {p.testCtaQuestion} — gratis y sin registro.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={evaluacionHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 font-body text-base font-semibold text-primary transition duration-150 hover:opacity-90 active:scale-[0.985]"
              >
                {p.testCtaLabel}
              </Link>
              <ButtonLink
                href={whatsappLink}
                variant="whatsapp"
                size="lg"
                external
              >
                Escribir por WhatsApp
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
