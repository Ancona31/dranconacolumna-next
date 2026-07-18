"use client";

import { useState } from "react";
import BodyFigureSVG, {
  BODY_ZONES,
  type BodyZoneId,
} from "@/components/home/BodyFigureSVG";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";
import { getZoneLabel } from "@/lib/i18n/zone-labels";

// viewBox de BodyFigureSVG tras F2.a: ancho 300, con la figura centrada por un
// desplazamiento de +40 en X; alto sin cambios. Los botones táctiles se
// posicionan sumando ese offset al cx del nodo.
const VIEW_W = 300;
const VIEW_H = 540;
const FIGURE_OFFSET_X = 40;

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

  // Al montar no hay zona resaltada: el chip solo aparece con hover/focus real
  // del usuario (antes se defolteaba a la primera zona → chip fantasma "cadera").
  const highlighted = hovered ?? undefined;

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

      {/* Ancho escalado ×300/220 respecto a F2 para que la figura conserve su
          tamaño aparente pese al viewBox más ancho; el margen extra es el aire
          lateral de los chips. */}
      <div className="relative mx-auto mt-8 w-[85%] max-w-[409px]">
        <BodyFigureSVG
          highlightedZone={highlighted}
          mode="selected"
          zoneLabels={zoneLabels}
          ariaLabel={ui.figureAria}
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
                left: `${((zone.cx + FIGURE_OFFSET_X) / VIEW_W) * 100}%`,
                top: `${(zone.cy / VIEW_H) * 100}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
