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

/**
 * Lado del botón táctil sobre la figura: 48 px, o menos si la figura es
 * angosta. 12 % del ancho cabe entre los dos nodos más cercanos (Espalda baja
 * y Cadera, a 37.8 de 300 unidades = 12.6 %), así que a 320 px los botones ya
 * no se enciman (antes ganaba el último del DOM). La lista de texto de abajo
 * es la vía cómoda para tocar a esos tamaños.
 */
const HIT_SIZE = "min(3rem, 12%)";

/** Clic normal (sin teclas ni botón medio): ese lo resuelve el JS en sitio. */
function isPlainClick(e: React.MouseEvent) {
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0);
}

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

  /**
   * Cada zona es un enlace real a la entrada directa (?zona=): antes de que
   * hidrate el JS (red lenta) el toque navega y el servidor abre el flujo; ya
   * hidratado, el clic se queda en la página y abre el flujo sin recargar.
   */
  function zoneLinkProps(id: BodyZoneId) {
    return {
      href: ui.zoneHref(id),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        onSelect(id);
      },
      // Señal al apoyar el dedo (antes del cambio de pantalla): se enciende
      // el nodo y su chip con el nombre de la zona.
      onPointerDown: () => setHovered(id),
      // Si el dedo se va (scroll), no queda una zona encendida de más.
      onPointerCancel: () => setHovered(null),
    };
  }

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
          const style = {
            left: `${((zone.cx + FIGURE_OFFSET_X) / VIEW_W) * 100}%`,
            top: `${(zone.cy / VIEW_H) * 100}%`,
            width: HIT_SIZE,
          };
          const className =
            "absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-100 ease-out active:bg-accent/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";
          if (!available) {
            return (
              <span
                key={zone.id}
                aria-hidden="true"
                className={className}
                style={style}
              />
            );
          }
          return (
            <a
              key={zone.id}
              {...zoneLinkProps(zone.id)}
              aria-label={ui.zoneAria(zoneLabels[zone.id])}
              onMouseEnter={() => setHovered(zone.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(zone.id)}
              onBlur={() => setHovered(null)}
              className={className}
              style={style}
            />
          );
        })}
      </div>

      {/* Las mismas zonas en texto: en táctil la figura no dice qué es cada
          punto, y sirve con texto grande y lector de pantalla. */}
      <p className="mt-6 font-body text-sm text-muted">{ui.listLabel}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {BODY_ZONES.filter((zone) => availableZones.includes(zone.id)).map(
          (zone) => (
            <li key={zone.id}>
              <a
                {...zoneLinkProps(zone.id)}
                className="inline-flex min-h-11 items-center rounded-full border border-ink/15 bg-background px-4 font-body text-sm text-ink transition-[transform,background-color,border-color] duration-100 ease-out hover:border-accent hover:bg-primary-soft active:scale-[0.97] active:bg-primary-soft"
              >
                {zoneLabels[zone.id]}
              </a>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
