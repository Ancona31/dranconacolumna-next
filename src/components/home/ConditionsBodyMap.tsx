"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BODY_PATH } from "@/components/home/BodyFigureSVG";
import { CONDITIONS, type Condition, type ConditionSlug } from "@/lib/conditions";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";
import { routeFor } from "@/lib/i18n/slug-map";

type ConditionsBodyMapProps = {
  locale: Locale;
  /** Nivel del encabezado: "h1" en el índice, "h2" como sección de la home. */
  headingAs?: "h1" | "h2";
};

// Un nodo dibujado en la silueta: el número, su posición y el primer
// padecimiento de esa zona (destino al hacer clic en el punto).
type MapNode = {
  n: string;
  cx: number;
  cy: number;
  slug: ConditionSlug;
  nombre: string;
};

// Encuadre de la figura. "full" (desktop) muestra el cuerpo entero; "torso"
// (móvil) recorta a cabeza-torso-cadera para una figura compacta.
type FigureCrop = "full" | "torso";
// Límites del recorte torso: solo se dibujan los nodos que caen dentro (1-6).
const TORSO_BOUNDS = { minX: 20, maxX: 200, minY: 10, maxY: 330 };

export default function ConditionsBodyMap({
  locale,
  headingAs = "h2",
}: ConditionsBodyMapProps) {
  const cc = getHomeContent(locale).conditions;
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const nombreOf = (slug: Condition["slug"]) => cc.items[slug].nombre;
  const detalleOf = (slug: Condition["slug"]) => cc.items[slug].detalle;
  const hrefOf = (slug: Condition["slug"]) =>
    routeFor(`/padecimientos/${slug}`, locale);
  const evaluacionHref = routeFor("/evaluacion", locale);

  // Un nodo por número, en el orden de aparición; su destino es el primer
  // padecimiento que lo usa. (Sin useMemo manual: el React Compiler lo
  // optimiza y la memoización manual con dependencia `cc` no se preservaba.)
  const nodes: MapNode[] = [];
  {
    const seen = new Set<string>();
    for (const c of CONDITIONS) {
      if (c.node && !seen.has(c.node.n)) {
        seen.add(c.node.n);
        nodes.push({
          n: c.node.n,
          cx: c.node.cx,
          cy: c.node.cy,
          slug: c.slug,
          nombre: cc.items[c.slug].nombre,
        });
      }
    }
  }

  const columna = CONDITIONS.filter((c) => c.grupo === "columna");
  const ortopedia = CONDITIONS.filter((c) => c.grupo === "ortopedia");
  const grupoLabel = (id: Condition["grupo"]) =>
    id === "columna" ? cc.groupSpine : cc.groupOrtho;

  const Heading = headingAs;

  // Silueta compartida entre desktop ("full") y móvil ("torso"): mismo path y
  // misma lógica de nodos; solo cambian viewBox, tamaños y qué nodos entran.
  const renderFigure = (crop: FigureCrop) => {
    const isTorso = crop === "torso";
    const viewBox = isTorso ? "20 10 180 320" : "0 0 220 540";
    const nodeR = isTorso ? 10 : 12;
    const haloR = isTorso ? 18 : 20;
    const fontSize = isTorso ? 11 : 13;
    // Radio del área táctil invisible (unidades del viewBox). El torso se pinta
    // a 190px de ancho (escala ~1.06) y la figura completa a ≥1.4x: con estos
    // radios cada nodo ofrece ≥44px de toque aunque el punto se vea más
    // pequeño. Tope: 21 = la mitad de la distancia cuello–dorsal (42), para que
    // las áreas de nodos vecinos no se pisen.
    const hitR = isTorso ? 21 : 18;
    const figureNodes = isTorso
      ? nodes.filter(
          (nd) =>
            nd.cx >= TORSO_BOUNDS.minX &&
            nd.cx <= TORSO_BOUNDS.maxX &&
            nd.cy >= TORSO_BOUNDS.minY &&
            nd.cy <= TORSO_BOUNDS.maxY
        )
      : nodes;

    return (
      // role="group" y no "img": un img oculta a sus hijos al lector de
      // pantalla, y los nodos son enlaces que deben poder anunciarse.
      <svg
        viewBox={viewBox}
        className="h-auto w-full"
        role="group"
        aria-label={cc.figureAria}
      >
        <path
          d={BODY_PATH}
          fill="var(--color-accent, #1a6299)"
          opacity="0.12"
        />

        {figureNodes.map((node) => {
          const isActive = node.n === active;
          const go = () => router.push(hrefOf(node.slug));
          // En el torso, la zona lumbar (3) conserva su halo de dolor estático.
          const painHalo = isTorso && node.n === "3";
          return (
            <g
              key={node.n}
              role="link"
              tabIndex={0}
              aria-label={`${cc.zoneAriaBefore} (${node.nombre})`}
              onMouseEnter={() => setActive(node.n)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(node.n)}
              onBlur={() => setActive(null)}
              onClick={go}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  go();
                }
              }}
              className="cursor-pointer"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                transform: isActive && !reduced ? "scale(1.12)" : "scale(1)",
                transition: reduced ? undefined : "transform 150ms var(--ease-out)",
              }}
            >
              {/* Área táctil: transparente pero pintada, así recibe el toque. */}
              <circle cx={node.cx} cy={node.cy} r={hitR} fill="transparent" />
              {painHalo && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={haloR}
                  fill="var(--color-pain, #d64541)"
                  opacity="0.25"
                />
              )}
              {/* Halo de resalte: aparece en hover/focus del nodo o de su(s) card(s). */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={haloR}
                fill="var(--color-accent, #1a6299)"
                style={{
                  opacity: isActive ? 0.25 : 0,
                  transition: reduced ? undefined : "opacity 150ms var(--ease-out)",
                }}
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r={nodeR}
                fill="var(--color-primary, #0b3c5d)"
                stroke="var(--color-background, #fbfbf9)"
                strokeWidth="2"
              />
              <text
                x={node.cx}
                y={node.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="inherit"
                fontSize={fontSize}
                fontWeight="700"
                fill="var(--color-background, #fbfbf9)"
              >
                {node.n}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Card desktop.
  const renderCard = (c: Condition) => {
    const highlighted = c.node ? c.node.n === active : false;
    const simbolo = c.node ? c.node.n : "±";
    const detalle = detalleOf(c.slug);
    return (
      <Link
        key={c.slug}
        href={hrefOf(c.slug)}
        onMouseEnter={() => setActive(c.node?.n ?? null)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(c.node?.n ?? null)}
        onBlur={() => setActive(null)}
        className={`group flex items-center gap-3 rounded-2xl border bg-background p-4 transition duration-150 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-raised active:scale-[0.98] ${
          highlighted
            ? "-translate-y-0.5 border-accent shadow-raised"
            : "border-ink/10"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-full font-heading text-sm font-bold ${
            c.node ? "bg-primary text-white" : "bg-primary-soft text-primary"
          }`}
        >
          {simbolo}
        </span>
        <span className="flex flex-col">
          <span className="font-heading text-base font-semibold text-ink">
            {nombreOf(c.slug)}
          </span>
          {detalle && (
            <span className="mt-0.5 font-body text-xs text-muted">
              {detalle}
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="ml-auto font-body text-accent transition-transform duration-150 group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    );
  };

  // Card móvil: compacta, hit-target de 48px, chip por grupo (primary/accent).
  const renderMobileCard = (c: Condition) => {
    const highlighted = c.node ? c.node.n === active : false;
    const simbolo = c.node ? c.node.n : "±";
    const chipBg = c.grupo === "columna" ? "bg-primary" : "bg-accent";
    const detalle = detalleOf(c.slug);
    return (
      <Link
        key={c.slug}
        href={hrefOf(c.slug)}
        onMouseEnter={() => setActive(c.node?.n ?? null)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(c.node?.n ?? null)}
        onBlur={() => setActive(null)}
        className={`group flex min-h-[48px] items-center gap-3 rounded-2xl border bg-background px-[14px] py-[13px] transition duration-150 ease-out hover:border-accent hover:shadow-raised active:scale-[0.98] ${
          highlighted ? "border-accent shadow-raised" : "border-ink/10"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 flex-none items-center justify-center rounded-full font-heading text-[12px] font-bold text-white ${chipBg}`}
        >
          {simbolo}
        </span>
        <span className="flex flex-col">
          <span className="font-heading text-[15px] font-semibold text-ink">
            {nombreOf(c.slug)}
          </span>
          {detalle && (
            <span className="mt-0.5 font-body text-[12.5px] text-muted">
              {detalle}
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="ml-auto font-body text-accent transition-transform duration-150 group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    );
  };

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div>
          <Heading className="font-heading text-[26px] font-bold text-primary text-center md:text-left md:text-4xl">
            {cc.h2}
          </Heading>
          {/* Subtítulo móvil: corto y centrado. */}
          <p className="mx-auto mt-3 max-w-[300px] text-center font-body text-sm text-ink/70 md:hidden">
            {cc.subMobile}
          </p>
          {/* Subtítulo desktop: con enlace a la evaluación. */}
          <p className="mt-3 hidden max-w-2xl font-body text-ink/70 md:block">
            {cc.subDesktopPre}
            <Link
              href={evaluacionHref}
              className="font-semibold text-accent hover:underline"
            >
              {cc.subDesktopLink}
            </Link>
            .
          </p>
        </div>

        {/* ===== Desktop (≥ md): silueta completa + dos listas =====
            Tablet (md): figura + listas apiladas en la segunda columna; a tres
            columnas las tarjetas quedaban en ~230px. lg+: tres columnas (el
            contenedor de listas se disuelve con `lg:contents`). */}
        <div className="mt-10 hidden gap-8 md:grid md:grid-cols-[minmax(0,0.8fr)_1fr] md:gap-10 lg:grid-cols-[minmax(0,0.9fr)_1fr_1fr]">
          {/* Silueta con nodos numerados (navegación, no decoración).
              Sin caja de fondo: la figura va directa sobre el fondo de sección. */}
          <div className="md:mx-0 md:w-full">{renderFigure("full")}</div>

          <div className="space-y-10 lg:contents lg:space-y-0">
            {/* Columna */}
            <div>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {grupoLabel("columna")}
              </h3>
              <div className="mt-4 space-y-3">{columna.map(renderCard)}</div>
            </div>

            {/* Ortopedia y traumatología */}
            <div>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {grupoLabel("ortopedia")}
              </h3>
              <div className="mt-4 space-y-3">
                {ortopedia.map(renderCard)}

                {/* Cierre: puerta a la evaluación para quien no se ubica. */}
                <Link
                  href={evaluacionHref}
                  className="flex items-center gap-3 rounded-2xl border border-accent bg-primary-soft p-4 transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-raised active:scale-[0.98]"
                >
                  <span className="font-heading text-base font-semibold text-primary">
                    {cc.ctaCard}
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-auto font-body text-accent"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Móvil (< md): una columna apilada, figura recortada al torso ===== */}
        <div className="md:hidden">
          {/* Figura compacta + leyenda de zonas fuera del encuadre. */}
          <div className="mt-8 flex flex-col items-center">
            <div className="w-[190px]">{renderFigure("torso")}</div>
            <p className="mt-3 text-center font-body text-xs text-muted">
              {cc.legendMobile}
            </p>
          </div>

          {/* Columna */}
          <div className="mt-8">
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {grupoLabel("columna")}
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {columna.map(renderMobileCard)}
            </div>
          </div>

          {/* Ortopedia y traumatología */}
          <div className="mt-8">
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {grupoLabel("ortopedia")}
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {ortopedia.map(renderMobileCard)}
            </div>
          </div>

          {/* CTA punteado a ancho completo. */}
          <Link
            href={evaluacionHref}
            className="mt-6 flex items-center justify-center rounded-xl border-[1.5px] border-dashed border-primary/30 bg-primary-soft px-4 py-[15px] text-center font-body text-[14px] font-semibold text-accent transition duration-150 ease-out hover:border-accent active:scale-[0.98]"
          >
            {cc.ctaMobile}
          </Link>
        </div>
      </div>
    </section>
  );
}
