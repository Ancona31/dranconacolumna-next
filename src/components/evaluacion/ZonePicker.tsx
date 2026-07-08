"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import BodyFigureSVG, {
  BODY_ZONES,
  type BodyZoneId,
} from "@/components/home/BodyFigureSVG";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// viewBox de BodyFigureSVG.
const VIEW_W = 220;
const VIEW_H = 540;

type ZonePickerProps = {
  availableZones: BodyZoneId[];
  onSelect: (zoneId: BodyZoneId) => void;
};

export default function ZonePicker({
  availableZones,
  onSelect,
}: ZonePickerProps) {
  const [hovered, setHovered] = useState<BodyZoneId | null>(null);
  const [sheetZone, setSheetZone] = useState<BodyZoneId | null>(null);

  const highlighted = hovered ?? availableZones[0] ?? "cadera";

  function handleZone(id: BodyZoneId) {
    if (availableZones.includes(id)) {
      onSelect(id);
    } else {
      setSheetZone(id);
    }
  }

  const sheetLabel =
    BODY_ZONES.find((z) => z.id === sheetZone)?.label ?? "esta zona";
  const sheetLink = buildWhatsAppLink(
    `Hola Dr. Ancona, me interesa una evaluación de ${sheetLabel.toLowerCase()}.`
  );

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <h1 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
        ¿Dónde te duele?
      </h1>
      <p className="mt-2 font-body text-ink/70">
        Toca la zona donde sientes la molestia.
      </p>

      <div className="relative mx-auto mt-8 w-[62%] max-w-[300px]">
        <BodyFigureSVG
          highlightedZone={highlighted}
          showChip
          className="h-auto w-full text-primary"
        />

        {/* Overlay de zonas táctiles */}
        {BODY_ZONES.map((zone) => {
          const available = availableZones.includes(zone.id);
          return (
            <button
              key={zone.id}
              type="button"
              aria-label={
                available
                  ? `Evaluar ${zone.label}`
                  : `${zone.label} (próximamente)`
              }
              onClick={() => handleZone(zone.id)}
              onMouseEnter={() => setHovered(zone.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(zone.id)}
              onBlur={() => setHovered(null)}
              className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                left: `${(zone.cx / VIEW_W) * 100}%`,
                top: `${(zone.cy / VIEW_H) * 100}%`,
              }}
            />
          );
        })}
      </div>

      <p className="mt-6 font-body text-sm text-ink/50">
        Por ahora la evaluación de cadera está disponible. El resto llega muy
        pronto.
      </p>

      {/* Bottom sheet para zonas aún no disponibles */}
      {sheetZone && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setSheetZone(null)}
            aria-hidden="true"
          />
          <div className="eval-sheet relative w-full max-w-md rounded-t-3xl bg-background p-6 text-left shadow-xl sm:rounded-3xl">
            <h2 className="font-heading text-xl font-bold text-primary">
              {sheetLabel}
            </h2>
            <p className="mt-2 font-body text-ink/75">
              La evaluación de {sheetLabel.toLowerCase()} estará disponible muy
              pronto. Mientras tanto, escríbenos y te orientamos.
            </p>
            <a
              href={sheetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
              Escribir por WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setSheetZone(null)}
              className="mt-3 w-full rounded-full px-6 py-3 font-body text-sm font-semibold text-accent transition-colors duration-150 hover:bg-primary-soft"
            >
              Elegir otra zona
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
