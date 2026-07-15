import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { CEDULA_PROFESIONAL, CEDULA_ESPECIALIDAD } from "@/lib/config";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";

export default function TrustBar({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).trust;

  const items = [
    { key: "rating", node: <RatingItem label={c.rating} /> },
    { key: "cirugias", node: <span>{c.surgeries}</span> },
    {
      key: "cedula",
      node: <CedulaItem profLabel={c.cedulaProf} espLabel={c.cedulaEsp} />,
    },
    { key: "cert", node: <span>{c.certification}</span> },
  ];

  return (
    <section className="bg-primary text-white">
      <Reveal className="mx-auto max-w-6xl px-4 py-3">
        {/* Móvil: grid 2x2 */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-center font-body text-xs text-white/90 md:hidden">
          {items.map((item) => (
            <li key={item.key} className="flex items-center justify-center">
              {item.node}
            </li>
          ))}
        </ul>

        {/* Desktop: una línea con separadores */}
        <ul className="hidden items-center justify-center gap-4 font-body text-sm text-white/90 md:flex">
          {items.map((item, i) => (
            <li key={item.key} className="flex items-center gap-4">
              {item.node}
              {i < items.length - 1 && (
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function RatingItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1">
      <Star
        className="h-4 w-4 text-[#E9B44C]"
        strokeWidth={1.5}
        fill="currentColor"
      />
      <span>{label}</span>
    </span>
  );
}

function CedulaItem({
  profLabel,
  espLabel,
}: {
  profLabel: string;
  espLabel: string;
}) {
  return (
    <span>
      {/* Móvil (grid 2x2): solo la cédula de especialista para no saturar. */}
      <span className="md:hidden">
        {espLabel} {CEDULA_ESPECIALIDAD}
      </span>
      {/* Desktop: ambas cédulas. */}
      <span className="hidden md:inline">
        {profLabel} {CEDULA_PROFESIONAL} · {espLabel} {CEDULA_ESPECIALIDAD}
      </span>
    </span>
  );
}
