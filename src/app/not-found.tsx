import type { Metadata } from "next";
import Link from "next/link";
import ButtonLink from "@/components/ui/Button";

export const metadata: Metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center md:py-32">
        <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Error 404
        </p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
          Página no encontrada
        </h1>
        <p className="mt-4 max-w-md font-body text-lg text-ink/70">
          La página que buscas no existe o cambió de dirección.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <ButtonLink href="/padecimientos" size="lg">
            Ver padecimientos
          </ButtonLink>
          <Link
            href="/"
            className="font-body text-sm font-semibold text-accent hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
