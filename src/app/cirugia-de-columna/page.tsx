import type { Metadata } from "next";
import Link from "next/link";
import { Microscope, Wrench, Syringe, Monitor } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";

export const metadata: Metadata = {
  title: "Cirugía de columna en Mérida — mínima invasión",
  description:
    "Cirugía de columna con alta especialidad en Mérida: hernia de disco, canal estrecho, fracturas vertebrales. Técnicas de mínima invasión cuando el caso lo permite.",
};

const TECNICAS = [
  {
    Icon: Microscope,
    title: "Microdiscectomía endoscópica",
    text: "Extracción de la hernia de disco a través de un endoscopio, con incisión menor a un centímetro. En la mayoría de los casos, alta el mismo día o en 24 horas.",
  },
  {
    Icon: Wrench,
    title: "Instrumentación percutánea",
    text: "Tornillos y barras colocados a través de la piel, sin cortar los músculos de la espalda. Menos sangrado y menos dolor postoperatorio.",
  },
  {
    Icon: Syringe,
    title: "Cifoplastia y vertebroplastia",
    text: "Estabilización de fracturas vertebrales por compresión — frecuentes en osteoporosis — mediante cemento óseo. El alivio del dolor suele sentirse en horas.",
  },
  {
    Icon: Monitor,
    title: "Cirugía asistida por navegación",
    text: "Guía por imagen en tiempo real para colocar cada implante con precisión milimétrica y máxima seguridad para tus nervios.",
  },
];

export default function CirugiaDeColumnaPage() {
  const whatsappLink = buildWhatsAppLink(
    "Hola Dr. Ancona, quiero una valoración de columna."
  );

  return (
    <>
      {/* Hero de página */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <Reveal>
            <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Mi subespecialidad
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
              Cirugía de columna
            </h1>
            <p className="mt-5 max-w-3xl font-body text-lg text-ink/80">
              La columna es mi alta especialidad: cervical, dorsal y lumbar. Y
              aunque soy cirujano, la mayoría de los pacientes que llegan a mi
              consulta por dolor de espalda no terminan en el quirófano —
              terminan entendiendo qué tienen y con un plan que funciona.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/quirofano-2.jpg"
                alt="Cirugía endoscópica de columna: el monitor muestra la visión del endoscopio en tiempo real"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cuándo se considera la cirugía */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Cuándo se considera la cirugía
            </h2>
            <p className="mt-6 font-body text-ink/75">
              La cirugía de columna se considera cuando el tratamiento
              conservador bien llevado no fue suficiente, o cuando hay datos que
              no admiten espera: pérdida de fuerza progresiva, alteración de la
              sensibilidad que avanza, o compresión importante de un nervio.
              Nunca es la primera opción por dolor solamente — y desconfía de
              quien te la ofrezca así.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Técnicas de mínima invasión */}
      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Técnicas de mínima invasión: cuándo sí y cuándo no
            </h2>
            <p className="mt-6 max-w-3xl font-body text-ink/75">
              Mi formación de alta especialidad incluye técnicas de mínima
              invasión: operar a través de incisiones de uno a dos centímetros,
              respetando el músculo, con menos sangrado y recuperación más
              rápida. No todos los casos son candidatos — y ser honesto en eso
              es parte del trabajo. Cuando tu caso lo permite, estas son las
              técnicas que uso:
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {TECNICAS.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80} className="flex">
                <div className="flex flex-1 flex-col rounded-2xl border border-primary/10 bg-background p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-primary">
                    {title}
                  </h3>
                  <p className="mt-3 font-body text-ink/75">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-8 max-w-3xl font-body text-sm text-ink/60">
              ¿Tu caso no es candidato a mínima invasión? También realizo
              cirugía abierta cuando es lo más seguro — la técnica se elige por
              tu anatomía y tu diagnóstico, no por moda.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cómo es la recuperación */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-primary">
              Cómo es la recuperación
            </h2>
            <p className="mt-6 font-body text-ink/75">
              Depende del procedimiento, pero en cirugía de mínima invasión la
              mayoría de mis pacientes camina el mismo día, se va a casa en 24 a
              48 horas y retoma actividades ligeras en dos a cuatro semanas. Te
              entrego un plan de recuperación claro y revisiones programadas — y
              mi WhatsApp para el camino.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-white">
              ¿Te dijeron que necesitas cirugía de columna?
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-white/80">
              Una segunda opinión a tiempo vale mucho. Evalúa tu caso gratis o
              escríbeme.
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
                origen="cirugia_cta"
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
