"use client";

import { useState } from "react";
import BodyFigureSVG, {
  BODY_ZONES,
  type BodyZoneId,
} from "@/components/home/BodyFigureSVG";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";
import { getZoneLabel } from "@/lib/i18n/zone-labels";

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
  locale?: Locale;
};

export default function ZonePicker({
  availableZones,
  onSelect,
  locale = "es",
}: ZonePickerProps) {
  const [hovered, setHovered] = useState<BodyZoneId | null>(null);
  const ui = getEvaluationUi(locale).zonePicker;

  const highlighted = hovered ?? availableZones[0] ?? "cadera";

  // Etiquetas por locale para el chip de la silueta y los aria-label. En ES
  // resuelven a la etiqueta interna de BODY_ZONES (render byte-idéntico).
  const zoneLabels = Object.fromEntries(
    BODY_ZONES.map((z) => [z.id, getZoneLabel(z.id, locale)])
  ) as Record<BodyZoneId, string>;

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <h1 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
        {ui.h1}
      </h1>
      <p className="mt-2 font-body text-ink/70">{ui.subtitle}</p>

      <div className="relative mx-auto mt-8 w-[62%] max-w-[300px]">
        <BodyFigureSVG
          highlightedZone={highlighted}
          mode="selected"
          zoneLabels={zoneLabels}
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
              aria-label={ui.zoneAria(zoneLabels[zone.id])}
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
