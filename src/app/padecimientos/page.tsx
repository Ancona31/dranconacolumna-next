import type { Metadata } from "next";
import Link from "next/link";
import { CONDITIONS, CONDITION_GROUPS } from "@/lib/conditions";

export const metadata: Metadata = { title: "Padecimientos" };

export default function PadecimientosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <h1 className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">
        Padecimientos que trato
      </h1>

      <div className="mt-10 space-y-10">
        {CONDITION_GROUPS.map((group) => {
          const items = CONDITIONS.filter((c) => c.grupo === group.id);
          return (
            <div key={group.id}>
              <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
                {group.label}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/padecimientos/${c.slug}`}
                    className="group flex items-start justify-between gap-2 rounded-2xl border border-ink/10 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
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
                      className="font-body text-accent transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
