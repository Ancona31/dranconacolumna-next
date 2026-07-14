import type { Metadata } from "next";

export const metadata: Metadata = { title: "Where does it hurt?" };

export default function EnHome() {
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center md:py-32">
        <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Orthopedics · Traumatology · Spine
        </p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
          Where does it hurt?
        </h1>
        <p className="mt-4 max-w-md font-body text-lg text-ink/70">
          English version coming soon.
        </p>
      </div>
    </section>
  );
}
