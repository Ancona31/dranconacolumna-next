"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, useSyncExternalStore } from "react";
import Link from "next/link";
import Skeleton3D from "@/components/skeleton3d/Skeleton3D";
import { CONDITIONS, type Condition, type ConditionSlug } from "@/lib/conditions";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";
import { routeFor } from "@/lib/i18n/slug-map";
import { CONDITION_SCENARIOS, IDLE_TOUR, REST_POSTER } from "@/lib/skeleton3d/scenarios";
import { useMediaQuery } from "@/components/home/conditions3d/useMediaQuery";
import { useScrollSpy } from "@/components/home/conditions3d/useScrollSpy";
import { useHeaderHeight } from "@/components/home/conditions3d/useHeaderHeight";

type ConditionsBodyMapProps = {
  locale: Locale;
  /** Nivel del encabezado: "h1" en el índice, "h2" como sección de la home.
   *  Con "h1" el título y el subtítulo van en la cabecera de página estándar
   *  (banda bg-primary-soft + eyebrow), como Contacto, Sobre mí y Cirugía. */
  headingAs?: "h1" | "h2";
};

/**
 * Modo hover de PC (plan §5): ancho de PC Y puntero con hover. Un iPad en
 * horizontal (≥1024 px, táctil) usa el layout de PC pero activa por
 * scroll-spy, como la tablet.
 */
const HOVER_MQ = "(min-width: 1024px) and (hover: hover)";
/** Arrastrar para girar solo con mouse/trackpad (D6). */
const FINE_POINTER_MQ = "(hover: hover) and (pointer: fine)";
/**
 * Pantalla baja (celular en horizontal, PC con zoom al 200 %) por debajo
 * del layout de PC: el escenario deja de ser fijo y no hay scroll-spy (no
 * quedaría espacio para leer la lista). Debe coincidir con las clases
 * `max-lg:[@media(max-height:600px)]:…` de abajo.
 */
const LOW_MQ = "(max-width: 1023px) and (max-height: 600px)";
/** Al salir de una tarjeta se espera un instante: pasar a la vecina no regresa al reposo. */
const LEAVE_DELAY = 140;
/**
 * Intención de hover (PC): al pasar de una tarjeta activa a otra se espera
 * 70 ms, así cruzar la lista con el mouse no dispara escenarios intermedios.
 * Desde el reposo y con el foco de teclado la respuesta es inmediata.
 */
const HOVER_INTENT = 70;

/** Fondo "escenario" azul tinta (D1-A): solo detrás del modelo. */
const STAGE_BG = "radial-gradient(120% 90% at 50% 40%, var(--color-primary) 0%, #06243a 75%)";

const noopSubscribe = () => () => {};

export default function ConditionsBodyMap({
  locale,
  headingAs = "h2",
}: ConditionsBodyMapProps) {
  const cc = getHomeContent(locale).conditions;
  const [active, setActive] = useState<ConditionSlug | null>(null);
  // Pausa del 3D (WCAG 2.2.2): detiene recorrido, giro y latidos.
  const [paused, setPaused] = useState(false);
  const hoverMode = useMediaQuery(HOVER_MQ);
  const finePointer = useMediaQuery(FINE_POINTER_MQ);
  const lowScreen = useMediaQuery(LOW_MQ);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const stageRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const headerH = useHeaderHeight();

  const activate = useCallback((slug: ConditionSlug, delay = 0) => {
    window.clearTimeout(timer.current);
    if (delay > 0) timer.current = window.setTimeout(() => setActive(slug), delay);
    else setActive(slug);
  }, []);
  const deactivate = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(null), LEAVE_DELAY);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Tablet, celular y PC táctil (D4-A): la tarjeta más cercana al centro del
  // área visible junto al escenario fijo activa su animación. Tocar navega.
  useScrollSpy({
    // `hydrated`: en el primer render (hidratación) las media queries aún
    // traen el valor del servidor; sin esta guarda el spy se activaba un
    // instante en PC, contaba como interacción y cancelaba el recorrido.
    enabled: hydrated && !hoverMode && !lowScreen,
    stageRef,
    listRef: listsRef,
    layoutKey: headerH,
    onChange: (slug) => (slug ? activate(slug) : deactivate()),
  });

  const nombreOf = (slug: ConditionSlug) => cc.items[slug].nombre;
  const detalleOf = (slug: ConditionSlug) => cc.items[slug].detalle;
  const hrefOf = (slug: ConditionSlug) => routeFor(`/padecimientos/${slug}`, locale);
  const evaluacionHref = routeFor("/evaluacion", locale);

  const columna = CONDITIONS.filter((c) => c.grupo === "columna");
  const ortopedia = CONDITIONS.filter((c) => c.grupo === "ortopedia");
  const grupoLabel = (id: Condition["grupo"]) =>
    id === "columna" ? cc.groupSpine : cc.groupOrtho;

  const Heading = headingAs;
  const isPage = headingAs === "h1";
  // Bajo un h1 (índice /padecimientos) las etiquetas de grupo son h2.
  const GroupHeading = headingAs === "h1" ? "h2" : "h3";

  // Eventos de tarjeta: hover solo en modo PC (en táctil el toque navega);
  // el foco de teclado activa en cualquier ancho y le gana al scroll-spy.
  const cardEvents = (slug: ConditionSlug) => ({
    "data-condition": slug,
    onMouseEnter: hoverMode
      ? () => activate(slug, active !== null && active !== slug ? HOVER_INTENT : 0)
      : undefined,
    onMouseLeave: hoverMode ? deactivate : undefined,
    onFocus: () => activate(slug),
    onBlur: deactivate,
  });

  // Indicador de la tarjeta: punto tenue que se enciende en rojo de dolor
  // (el mismo del 3D) mientras corre su animación.
  const renderDot = (on: boolean, size: "md" | "sm") => (
    <span
      aria-hidden="true"
      className={`flex flex-none items-center justify-center ${size === "md" ? "h-8 w-8" : "h-6 w-6"}`}
    >
      <span
        className={`block rounded-full transition-[transform,box-shadow,background-color] duration-200 ease-out motion-reduce:transition-none ${
          size === "md" ? "h-2.5 w-2.5" : "h-2 w-2"
        } ${on ? "scale-125 bg-pain ring-4 ring-pain/20" : "bg-accent/30"}`}
      />
    </span>
  );

  // Texto de la tarjeta: `min-w-0` deja que la columna se encoja con texto
  // grande o zoom de iOS (si no, la flecha se sale de la tarjeta).
  const renderText = (c: Condition, mobile: boolean) => {
    const detalle = detalleOf(c.slug);
    return (
      <span className="flex min-w-0 flex-col">
        <span
          className={`font-heading font-semibold text-ink hyphens-auto [overflow-wrap:anywhere] ${
            mobile ? "text-[15px]" : "text-base"
          }`}
        >
          {nombreOf(c.slug)}
        </span>
        {detalle && (
          <span
            className={`mt-0.5 font-body text-muted hyphens-auto [overflow-wrap:anywhere] ${
              mobile ? "text-[12.5px]" : "text-xs"
            }`}
          >
            <span className="sr-only">, </span>
            {detalle}
          </span>
        )}
      </span>
    );
  };

  const arrow = (
    <span
      aria-hidden="true"
      className="ml-auto shrink-0 font-body text-accent transition-transform duration-150 ease-out group-hover:translate-x-0.5"
    >
      →
    </span>
  );

  // Margen de scroll (WCAG 2.4.11): al llegar con Tab, la tarjeta se coloca
  // en el hueco visible entre el escenario fijo y la barra móvil, no debajo
  // de ellos. Las variables se definen en la <section> por breakpoint.
  const cardScroll = "scroll-mt-[var(--card-smt)] scroll-mb-[var(--card-smb)]";

  // Card desktop / tablet.
  const renderCard = (c: Condition) => {
    const highlighted = c.slug === active;
    return (
      <li key={c.slug}>
        <Link
          href={hrefOf(c.slug)}
          {...cardEvents(c.slug)}
          className={`group flex min-h-[76px] items-center gap-3 rounded-2xl border bg-background p-4 transition-[translate,scale,border-color,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-raised active:scale-[0.98] ${cardScroll} ${
            highlighted
              ? "-translate-y-0.5 border-accent shadow-raised"
              : "border-ink/10"
          }`}
        >
          {renderDot(highlighted, "md")}
          {renderText(c, false)}
          {arrow}
        </Link>
      </li>
    );
  };

  // Card móvil: compacta, hit-target de 48px.
  const renderMobileCard = (c: Condition) => {
    const highlighted = c.slug === active;
    return (
      <li key={c.slug}>
        <Link
          href={hrefOf(c.slug)}
          {...cardEvents(c.slug)}
          className={`group flex min-h-[48px] items-center gap-3 rounded-2xl border bg-background px-[14px] py-[13px] transition-[translate,scale,border-color,box-shadow] duration-150 ease-out hover:border-accent hover:shadow-raised active:scale-[0.98] ${cardScroll} ${
            highlighted ? "border-accent shadow-raised" : "border-ink/10"
          }`}
        >
          {renderDot(highlighted, "sm")}
          {renderText(c, true)}
          {arrow}
        </Link>
      </li>
    );
  };

  // `tracking-…!`: globals.css cierra el tracking de todo h2 (sin capa, le
  // gana a la utilidad); en /padecimientos estas etiquetas son h2.
  const groupLabelClass =
    "font-body text-xs font-semibold uppercase tracking-[0.2em]! text-muted";

  const subDesktop = (
    <>
      {cc.subDesktopPre}
      <Link
        href={evaluacionHref}
        className="font-semibold text-accent hover:underline"
      >
        {cc.subDesktopLink}
      </Link>
      .
    </>
  );

  return (
    <>
      {isPage && (
        // Cabecera de página estándar (mismo patrón que Contacto, Sobre mí y
        // Cirugía): banda clara, eyebrow y h1 grande. La sección 3D va debajo.
        <section className="bg-primary-soft">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <div className="load-enter">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {cc.pageEyebrow}
              </p>
              <Heading className="mt-2 font-heading text-[clamp(2.25rem,1.6rem+2.6vw,3rem)] font-extrabold leading-tight text-primary">
                {cc.h2}
              </Heading>
              <p className="mt-5 max-w-3xl font-body text-lg text-ink/80 md:hidden">
                {cc.subMobile}
              </p>
              <p className="mt-5 hidden max-w-3xl font-body text-lg text-ink/80 md:block">
                {subDesktop}
              </p>
            </div>
          </div>
        </section>
      )}
      <section
        // data-conditions-section: el WhatsApp flotante se oculta mientras
        // esta sección está en pantalla (taparía tarjetas y escenario).
        data-conditions-section
        // --stage-top: alto en vivo del header (el escenario se pega justo
        // debajo). --card-smt / --card-smb: margen de scroll de las tarjetas =
        // lo que tapa el escenario fijo (pt-2 + alto + pb-3 + degradado) y la
        // barra móvil. En PC el escenario va al lado: solo el header. En
        // pantalla baja el escenario no es fijo.
        style={{ "--stage-top": `${headerH}px` } as CSSProperties}
        className="bg-background [--card-smb:calc(5rem+env(safe-area-inset-bottom))] [--card-smt:calc(var(--stage-top)+max(45svh,240px)+3rem)] md:[--card-smb:0.75rem] md:[--card-smt:calc(var(--stage-top)+clamp(240px,46svh,560px)+3rem)] lg:[--card-smt:calc(var(--stage-top)+1rem)] max-lg:[@media(max-height:600px)]:[--card-smt:calc(var(--stage-top)+0.75rem)]"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          {!isPage && (
            <div>
              <Heading className="font-heading text-3xl font-bold text-primary text-center md:text-left">
                {cc.h2}
              </Heading>
              {/* Subtítulo móvil: corto y centrado. */}
              <p className="mx-auto mt-3 max-w-[300px] text-center font-body text-sm text-ink/70 md:hidden">
                {cc.subMobile}
              </p>
              {/* Subtítulo desktop: con enlace a la evaluación. */}
              <p className="mt-3 hidden max-w-2xl font-body text-ink/70 md:block">
                {subDesktop}
              </p>
            </div>
          )}

          {/* ===== Esqueleto 3D + listas =====
              PC (lg+): tres columnas, el 3D fijo a la izquierda mientras pasan
              las listas. Tablet y celular: el 3D queda fijo arriba (bajo el
              header) y las listas pasan por debajo. Pantalla baja (< lg y
              ≤ 600 px de alto): el 3D va en el flujo normal, sin fijarse. Un
              solo lienzo WebGL para todos los anchos. */}
          <div className={`${isPage ? "" : "mt-8 md:mt-10 "}lg:grid lg:grid-cols-[minmax(0,0.9fr)_1fr_1fr] xl:grid-cols-[minmax(0,1.1fr)_1fr_1fr] lg:items-start lg:gap-8`}>
            {/* "Tapete" del color de la sección: tapa las tarjetas que pasan
                por debajo del escenario fijo, incluidas sus esquinas. El
                degradado de 20 px (::after) las desvanece en vez de cortarlas
                a cuchillo. */}
            <div
              ref={stageRef}
              className="sticky top-[var(--stage-top)] z-10 -mx-4 bg-background px-4 pt-2 pb-3 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-5 after:bg-gradient-to-b after:from-background after:to-transparent md:mx-0 md:px-0 lg:top-[calc(var(--stage-top)+1.5rem)] lg:pt-0 lg:pb-0 lg:after:hidden max-lg:[@media(max-height:600px)]:static max-lg:[@media(max-height:600px)]:after:hidden"
            >
              <div
                className="relative h-[45svh] min-h-[240px] overflow-hidden rounded-3xl shadow-card after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-white/5 md:h-[46svh] md:max-h-[560px] lg:h-[min(76vh,680px)] lg:max-h-none max-lg:[@media(max-height:600px)]:h-[70svh] max-lg:[@media(max-height:600px)]:min-h-[200px]"
                style={{ background: STAGE_BG }}
              >
                <Skeleton3D
                  scenario={active ? CONDITION_SCENARIOS[active] : null}
                  idleTour={IDLE_TOUR}
                  interactive={hoverMode && finePointer}
                  posterSrc={REST_POSTER}
                  // En el índice la sección es el h1: el póster es el LCP.
                  posterPriority={headingAs === "h1" ? "high" : "low"}
                  paused={paused}
                />
                {/* Pausa (WCAG 2.2.2), hermano del lienzo (que va con
                    aria-hidden). Siempre visible, 44 px, anillo de foco blanco
                    sobre el azul. Con "reducir movimiento" no hay nada que
                    pausar: se oculta ya desde el HTML del servidor. */}
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={cc.pause3d}
                  aria-pressed={paused}
                  title={paused ? cc.resume3d : cc.pause3d}
                  className="focus-ring-light absolute bottom-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-card ring-1 ring-white/40 transition-[background-color,transform] duration-150 ease-out hover:bg-white active:scale-95 aria-pressed:bg-white motion-reduce:hidden"
                >
                  {paused ? (
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 translate-x-px" fill="currentColor">
                      <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="currentColor">
                      <rect x="3.5" y="2.5" width="3" height="11" rx="0.8" />
                      <rect x="9.5" y="2.5" width="3" height="11" rx="0.8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div ref={listsRef} className="contents">
              {/* ===== PC y tablet (≥ md): dos listas =====
                  En tablet van apiladas en una sola columna: el scroll-spy
                  necesita una tarjeta por altura (dos columnas cruzarían la
                  línea a la vez). En PC cada lista es una columna del grid. */}
              <div className="mt-6 hidden gap-10 md:grid md:grid-cols-1 lg:contents">
                {/* Columna */}
                <div>
                  <GroupHeading className={groupLabelClass}>{grupoLabel("columna")}</GroupHeading>
                  <ul role="list" className="mt-4 space-y-3">
                    {columna.map(renderCard)}
                  </ul>
                </div>

                {/* Ortopedia y traumatología */}
                <div>
                  <GroupHeading className={groupLabelClass}>{grupoLabel("ortopedia")}</GroupHeading>
                  <ul role="list" className="mt-4 space-y-3">
                    {ortopedia.map(renderCard)}
                  </ul>

                  {/* Cierre: puerta a la evaluación para quien no se ubica.
                      Punteado como en celular: el borde accent sólido queda
                      para la tarjeta activa. */}
                  <Link
                    href={evaluacionHref}
                    className={`mt-3 flex items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-primary/30 bg-primary-soft p-4 transition-[translate,scale,border-color,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-raised active:scale-[0.98] ${cardScroll}`}
                  >
                    <span className="min-w-0 font-heading text-base font-semibold text-primary">
                      {cc.ctaCard}
                    </span>
                    <span aria-hidden="true" className="ml-auto shrink-0 font-body text-accent">
                      →
                    </span>
                  </Link>
                </div>
              </div>

              {/* ===== Celular (< md): una columna apilada ===== */}
              <div className="md:hidden">
                {/* Columna */}
                <div className="mt-5">
                  <GroupHeading className={groupLabelClass}>{grupoLabel("columna")}</GroupHeading>
                  <ul role="list" className="mt-3 flex flex-col gap-2">
                    {columna.map(renderMobileCard)}
                  </ul>
                </div>

                {/* Ortopedia y traumatología */}
                <div className="mt-8">
                  <GroupHeading className={groupLabelClass}>{grupoLabel("ortopedia")}</GroupHeading>
                  <ul role="list" className="mt-3 flex flex-col gap-2">
                    {ortopedia.map(renderMobileCard)}
                  </ul>
                </div>

                {/* CTA punteado a ancho completo. */}
                <Link
                  href={evaluacionHref}
                  className={`mt-6 flex items-center justify-center rounded-2xl border-[1.5px] border-dashed border-primary/30 bg-primary-soft px-4 py-[15px] text-center font-body text-[14px] font-semibold text-accent transition-[translate,scale,border-color,box-shadow] duration-150 ease-out hover:border-accent active:scale-[0.98] ${cardScroll}`}
                >
                  {cc.ctaMobile}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
