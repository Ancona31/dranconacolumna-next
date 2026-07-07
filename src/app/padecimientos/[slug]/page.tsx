import Placeholder from "@/components/Placeholder";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  return { title: `Padecimiento: ${slug}` };
}

export default async function PadecimientoSlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  return <Placeholder title={slug} phase={3} />;
}
