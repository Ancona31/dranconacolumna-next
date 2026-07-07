import Link from "next/link";
import { CONDITIONS } from "@/lib/conditions";

export default function ConditionsGrid() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-center font-heading text-3xl font-bold text-primary">
          Padecimientos que trato
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CONDITIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/padecimientos/${c.slug}`}
              className="group flex items-center justify-between gap-2 rounded-2xl border border-ink/10 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
            >
              <span className="font-heading text-base font-semibold text-ink">
                {c.nombre}
              </span>
              <span
                aria-hidden="true"
                className="font-body text-accent transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
