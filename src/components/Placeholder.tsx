type PlaceholderProps = {
  title: string;
  phase: number;
};

/** Contenido provisional para las rutas de la Fase 1. */
export default function Placeholder({ title, phase }: PlaceholderProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 font-body text-ink/70">En construcción — Fase {phase}</p>
    </section>
  );
}
