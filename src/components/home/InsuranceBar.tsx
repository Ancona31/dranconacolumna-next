export default function InsuranceBar() {
  return (
    <section className="border-t border-ink/10 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-center font-heading text-lg font-bold text-ink md:text-xl">
          ¿Tienes seguro de gastos médicos? Te ayudo con el trámite.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="flex h-12 w-28 items-center justify-center rounded-lg bg-ink/5 font-body text-xs font-medium uppercase tracking-wide text-ink/40"
            >
              Logo · Pendiente
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
