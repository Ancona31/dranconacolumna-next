import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import {
  CEDULA_PROFESIONAL,
  CEDULA_ESPECIALIDAD,
  CERTIFICACION,
} from "@/lib/config";

export default function TrustBar() {
  const items = [
    { key: "rating", node: <RatingItem /> },
    { key: "cirugias", node: <span>+200 cirugías de columna</span> },
    { key: "cedula", node: <CedulaItem /> },
    { key: "cert", node: <span>{CERTIFICACION}</span> },
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

function RatingItem() {
  return (
    <span className="flex items-center gap-1">
      <Star
        className="h-4 w-4 text-[#E9B44C]"
        strokeWidth={1.5}
        fill="currentColor"
      />
      <span>4.9 en Google</span>
    </span>
  );
}

function CedulaItem() {
  return (
    <span>
      {/* Móvil (grid 2x2): solo la cédula de especialista para no saturar. */}
      <span className="md:hidden">Céd. Esp. {CEDULA_ESPECIALIDAD}</span>
      {/* Desktop: ambas cédulas. */}
      <span className="hidden md:inline">
        Céd. Prof. {CEDULA_PROFESIONAL} · Céd. Esp. {CEDULA_ESPECIALIDAD}
      </span>
    </span>
  );
}
