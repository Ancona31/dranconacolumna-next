import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConditionTemplate from "@/components/padecimientos/ConditionTemplate";
import { getPadecimiento, PADECIMIENTOS } from "@/lib/padecimientos";
import { buildAlternates } from "@/lib/i18n/alternates";

type Params = { slug: string };

// Solo los slugs reales del registro se pre-generan; cualquier otro cae en
// notFound() y responde 404 en vez de indexar una página fantasma.
export function generateStaticParams(): Params[] {
  return Object.keys(PADECIMIENTOS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPadecimiento(slug);

  // Slug inexistente: no fabricamos metadata; notFound() en la página manda.
  if (!p) return {};

  return {
    // absolute: el metaTitle ya trae la marca; evita duplicar el template.
    title: { absolute: p.metaTitle },
    description: p.metaDescription,
    alternates: buildAlternates(`/padecimientos/${slug}`, "es"),
  };
}

export default async function PadecimientoSlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = getPadecimiento(slug);

  // Con el catálogo completo, un slug ausente es una URL inválida: 404 real.
  if (!p) notFound();

  return <ConditionTemplate p={p} locale="es" />;
}
