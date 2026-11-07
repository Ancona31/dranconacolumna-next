import { Star } from "lucide-react";
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
  ];

  // La certificación es el dato más largo: en la rejilla (celular y tablet)
  // va completa; en la línea de PC va la forma corta y la completa queda en
  // el title y para lectores de pantalla.
  const certFull = <span>{c.certification}</span>;
  const certShort = (
    <span title={c.certification}>
      <span aria-hidden="true">{c.certificationShort}</span>
      <span className="sr-only">{c.certification}</span>
    </span>
  );

  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-3">
        {/* Celular y tablet: rejilla 2x2. A 768 px los 4 datos no caben en
            una línea sin partirse. */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-center font-body text-xs text-white/90 md:text-sm lg:hidden">
          {[...items, { key: "cert", node: certFull }].map((item) => (
            <li
              key={item.key}
              className="flex min-w-0 items-center justify-center break-words *:min-w-0"
            >
              {item.node}
            </li>
          ))}
        </ul>

        {/* PC: una línea con separadores. Cada dato va entero
            (whitespace-nowrap); si alguna vez no cabe, baja el dato
            completo, nunca medio dato. */}
        <ul className="hidden flex-wrap items-center justify-center gap-x-6 gap-y-1 font-body text-sm text-white/90 lg:flex">
          {[...items, { key: "cert", node: certShort }].map((item, i, all) => (
            <li
              key={item.key}
              className="flex items-center gap-6 whitespace-nowrap"
            >
              {item.node}
              {i < all.length - 1 && (
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RatingItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1">
      <Star
        className="h-4 w-4 text-star-on-dark"
        strokeWidth={1.5}
        fill="currentColor"
        aria-hidden="true"
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
      {/* Rejilla 2x2: solo la cédula de especialista para no saturar. */}
      <span className="lg:hidden">
        {espLabel} {CEDULA_ESPECIALIDAD}
      </span>
      {/* PC: ambas cédulas. */}
      <span className="hidden lg:inline">
        {profLabel} {CEDULA_PROFESIONAL} · {espLabel} {CEDULA_ESPECIALIDAD}
      </span>
    </span>
  );
}
