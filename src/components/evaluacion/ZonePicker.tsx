"use client";

import { useState, type CSSProperties } from "react";
import { BODY_ZONES, type BodyZoneId } from "@/components/home/BodyFigureSVG";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";
import { getZoneLabel } from "@/lib/i18n/zone-labels";
import {
  ZONE_POSITIONS,
  ZONES_IMAGE,
  zonesSrcSet,
} from "@/lib/skeleton3d/zones2d";

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
 * angosta. Sobre la radiografía los dos nodos más cercanos (Cuello y Espalda
 * alta) quedan a ~16 % del ancho, así que con 12 % los botones no se enciman
 * ni a 320 px. La lista de texto de abajo es la vía cómoda para tocar a esos
 * tamaños.
 */
const HIT_SIZE = "min(3rem, 12%)";

/**
 * Ancho mostrado de la imagen: 85 % de la columna (max-w-md = 448 px, con
 * 16 px de padding por lado en la sección). Desde 480 px de viewport la
 * columna ya está en su máximo.
 */
const IMG_SIZES = "(min-width: 480px) 381px, calc(85vw - 28px)";

/**
 * Lado del chip con el nombre de la zona. Hacia donde hay aire y no hay otro
 * nodo a la misma altura: el brazo izquierdo de la imagen lo lleva hacia
 * fuera; Muñeca va debajo (a su derecha, a la misma altura, está Cadera); el
 * resto, a la derecha (del lado de la imagen sin nodos).
 */
const CHIP_SIDE: Record<BodyZoneId, "left" | "right" | "below"> = {
  cuello: "right",
  "espalda-alta": "right",
  "espalda-baja": "right",
  hombro: "left",
  codo: "left",
  muneca: "below",
  cadera: "right",
  rodilla: "right",
  tobillo: "right",
};

const CHIP_POSITION: Record<(typeof CHIP_SIDE)[BodyZoneId], string> = {
  left: "right-full top-1/2 mr-0.5 -translate-y-1/2",
  right: "left-full top-1/2 ml-0.5 -translate-y-1/2",
  below: "top-full left-1/2 -translate-x-1/2",
};

/** Desplazamiento de entrada del chip: llega desde el lado del nodo. */
const CHIP_FROM: Record<(typeof CHIP_SIDE)[BodyZoneId], CSSProperties> = {
  left: { "--chip-dx": "4px" } as CSSProperties,
  right: { "--chip-dx": "-4px" } as CSSProperties,
  below: { "--chip-dy": "-4px" } as CSSProperties,
};

/** Clic normal (sin teclas ni botón medio): ese lo resuelve el JS en sitio. */
function isPlainClick(e: React.MouseEvent) {
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0);
}

/** Punto de zona: anillo suave + punto de marca; el latido solo se ve activo. */
function NodeMark() {
  return (
    <>
      <span aria-hidden="true" className="zone-node__pulse" />
      <span aria-hidden="true" className="zone-node__ring" />
      <span aria-hidden="true" className="zone-node__dot" />
    </>
  );
}

export default function ZonePicker({
  availableZones,
  onSelect,
  locale = "es",
}: ZonePickerProps) {
  // Zona encendida por hover, foco o dedo apoyado. Al montar no hay ninguna:
  // el chip solo aparece con una interacción real (nada de chip fantasma).
  const [hovered, setHovered] = useState<BodyZoneId | null>(null);
  const ui = getEvaluationUi(locale).zonePicker;

  // Etiquetas por locale para el chip y los aria-label. En ES resuelven a la
  // etiqueta interna de BODY_ZONES.
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
      // Señal al apoyar el dedo (antes del cambio de pantalla): el nodo se
      // pone rojo y aparece el chip con el nombre de la zona.
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

      {/* Radiografía en tinta directo sobre el fondo, sin caja (como la
          sección 3D). Misma proporción 1:1.8 y mismo ancho que la silueta
          anterior: la pantalla no cambia de alto. Los nodos se posicionan en
          % sobre la caja de la imagen. */}
      <div
        role="group"
        aria-label={ui.figureAria}
        className="relative mx-auto mt-8 w-[85%] max-w-[409px]"
      >
        <picture>
          <source
            type="image/avif"
            srcSet={zonesSrcSet("avif")}
            sizes={IMG_SIZES}
          />
          {/* <img> nativo: next/image recodificaría el AVIF/WebP hecho a mano.
              Decorativo (las zonas llevan su propio nombre) y eager: es lo
              principal de la pantalla. */}
          <img
            src={`${ZONES_IMAGE.base}-450.webp`}
            srcSet={zonesSrcSet("webp")}
            sizes={IMG_SIZES}
            width={ZONES_IMAGE.width}
            height={ZONES_IMAGE.height}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="pointer-events-none block h-auto w-full select-none"
          />
        </picture>

        {/* Zonas táctiles sobre la imagen */}
        {BODY_ZONES.map((zone) => {
          const available = availableZones.includes(zone.id);
          const [left, top] = ZONE_POSITIONS[zone.id];
          const active = available && hovered === zone.id;
          const style = { left: `${left}%`, top: `${top}%`, width: HIT_SIZE };
          const className = `zone-node absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent${active ? " z-10" : ""}`;
          if (!available) {
            return (
              <span
                key={zone.id}
                aria-hidden="true"
                className={`${className} opacity-40`}
                style={style}
              >
                <NodeMark />
              </span>
            );
          }
          const side = CHIP_SIDE[zone.id];
          return (
            <a
              key={zone.id}
              {...zoneLinkProps(zone.id)}
              aria-label={ui.zoneAria(zoneLabels[zone.id])}
              data-active={active ? "" : undefined}
              onMouseEnter={() => setHovered(zone.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(zone.id)}
              onBlur={() => setHovered(null)}
              className={className}
              style={style}
            >
              <NodeMark />
              {/* Chip con el nombre: visual (el enlace ya lleva su
                  aria-label) y sin capturar el puntero. */}
              {active && (
                <span
                  aria-hidden="true"
                  className={`zone-chip pointer-events-none absolute whitespace-nowrap rounded-full bg-primary px-2.5 py-1 font-body text-xs font-semibold text-background ${CHIP_POSITION[side]}`}
                  style={CHIP_FROM[side]}
                >
                  {zoneLabels[zone.id]}
                </span>
              )}
            </a>
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
