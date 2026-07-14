import Link from "next/link";
import ButtonLink from "@/components/ui/Button";
import type { UiStrings } from "@/lib/i18n/types";

/**
 * Vista 404 compartida entre locales. El markup es idéntico para ES y EN;
 * solo cambian los strings y los destinos, que llegan por prop.
 */
export default function NotFoundView({ strings }: { strings: UiStrings }) {
  const { notFound } = strings;
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center md:py-32">
        <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {notFound.errorLabel}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
          {notFound.title}
        </h1>
        <p className="mt-4 max-w-md font-body text-lg text-ink/70">
          {notFound.description}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <ButtonLink href={notFound.ctaHref} size="lg">
            {notFound.ctaLabel}
          </ButtonLink>
          <Link
            href={notFound.homeHref}
            className="font-body text-sm font-semibold text-accent hover:underline"
          >
            {notFound.homeLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
