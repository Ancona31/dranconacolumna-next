import { IconStar } from "@/components/ui/Icons";
import { CEDULA_PROFESIONAL, CERTIFICACION } from "@/lib/config";

export default function TrustBar() {
  const items = [
    { key: "rating", node: <RatingItem /> },
    { key: "cirugias", node: <span>+200 cirugías de columna</span> },
    { key: "cedula", node: <span>Céd. Prof. {CEDULA_PROFESIONAL}</span> },
    { key: "cert", node: <span>{CERTIFICACION}</span> },
  ];

  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-3">
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
      </div>
    </section>
  );
}

function RatingItem() {
  return (
    <span className="flex items-center gap-1">
      <IconStar className="h-4 w-4 text-[#E9B44C]" />
      <span>4.9 en Google</span>
    </span>
  );
}
