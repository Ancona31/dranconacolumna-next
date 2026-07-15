import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConditionTemplate from "@/components/padecimientos/ConditionTemplate";
import { getPadecimientoEn, PADECIMIENTOS_EN } from "@/lib/padecimientos/en";

type Params = { slug: string };

// Solo los slugs del registro EN se pre-generan; cualquier otro cae en
// notFound() y responde 404 (la 404 en inglés del segmento (en)).
export function generateStaticParams(): Params[] {
  return Object.keys(PADECIMIENTOS_EN).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPadecimientoEn(slug);

  // Slug inexistente: no fabricamos metadata; notFound() en la página manda.
  // (El noindex EN lo hereda del layout (en) mientras dure la FASE.)
  if (!p) return {};

  return {
    // absolute: el metaTitle ya trae la marca; evita duplicar el template.
    title: { absolute: p.metaTitle },
    description: p.metaDescription,
  };
}

export default async function ConditionSlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = getPadecimientoEn(slug);

  // Slug ausente del registro EN: URL inválida, 404 real en inglés.
  if (!p) notFound();

  return <ConditionTemplate p={p} locale="en" />;
}
