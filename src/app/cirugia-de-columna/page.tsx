import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cirugía de columna en Mérida" };

const SECTIONS = [
  "Cuándo se considera la cirugía",
  "Técnicas de mínima invasión: cuándo sí y cuándo no",
  "Cómo es la recuperación",
];

export default function CirugiaDeColumnaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <h1 className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">
        Cirugía de columna
      </h1>

      <div className="mt-10 space-y-10">
        {SECTIONS.map((title) => (
          <section key={title}>
            <h2 className="font-heading text-2xl font-bold text-ink">{title}</h2>
            <p className="mt-3 font-body text-ink/70">
              Contenido en construcción — Fase 2D
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
