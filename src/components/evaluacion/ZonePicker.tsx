"use client";

import { useState } from "react";
import BodyFigureSVG, {
  BODY_ZONES,
  type BodyZoneId,
} from "@/components/home/BodyFigureSVG";

// viewBox de BodyFigureSVG.
const VIEW_W = 220;
const VIEW_H = 540;

type ZonePickerProps = {
  /**
   * Zonas con test registrado. Hoy son las nueve del mapa; una zona sin test
   * quedaría inhabilitada en vez de ofrecer un destino muerto.
   */
  availableZones: BodyZoneId[];
  onSelect: (zoneId: BodyZoneId) => void;
};

export default function ZonePicker({
  availableZones,
  onSelect,
}: ZonePickerProps) {
  const [hovered, setHovered] = useState<BodyZoneId | null>(null);

  const highlighted = hovered ?? availableZones[0] ?? "cadera";

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
              disabled={!available}
              aria-label={`Evaluar ${zone.label}`}
              onClick={() => onSelect(zone.id)}
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
    </div>
  );
}
