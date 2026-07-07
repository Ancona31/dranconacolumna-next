import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { CONDITIONS, CONDITION_GROUPS } from "@/lib/conditions";

export default function ConditionsGrid() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <h2 className="text-center font-heading text-3xl font-bold text-primary">
            Padecimientos que trato
          </h2>
        </Reveal>

        <div className="mt-10 space-y-10">
          {CONDITION_GROUPS.map((group) => {
            const items = CONDITIONS.filter((c) => c.grupo === group.id);
            return (
              <div key={group.id}>
                <Reveal>
                  <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
                    {group.label}
                  </h3>
                </Reveal>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {items.map((c, i) => (
                    <Reveal key={c.slug} delay={i * 80} className="flex">
                      <Link
                        href={`/padecimientos/${c.slug}`}
                        className="group flex flex-1 items-start justify-between gap-2 rounded-2xl border border-ink/10 bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
                      >
                        <span className="flex flex-col">
                          <span className="font-heading text-base font-semibold text-ink">
                            {c.nombre}
                          </span>
                          {c.detalle && (
                            <span className="mt-1 font-body text-xs text-ink/50">
                              {c.detalle}
                            </span>
                          )}
                        </span>
                        <span
                          aria-hidden="true"
                          className="font-body text-accent transition-transform duration-150 group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
