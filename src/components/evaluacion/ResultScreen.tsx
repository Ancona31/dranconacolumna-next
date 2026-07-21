"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlarmClock,
  AlertCircle,
  AlertTriangle,
  CalendarClock,
  Check,
  Dot,
  Dumbbell,
  Footprints,
  Heart,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Stethoscope,
  Zap,
} from "lucide-react";
import type {
  DomainId,
  DomainState,
  EvaluationResult,
  NonUrgentLevel,
} from "@/lib/evaluacion/types";
import {
  allDomainsGreen,
  buildAlertBanner,
  computeDomains,
  FUNC_COLORS,
  getEvaluationPlan,
  getPartialAnswersNote,
  getRecommendation,
  getRecommendationColors,
  getResultWhatsAppLink,
  getSemaphoreTitle,
  getWarningSigns,
  NIVEL_BADGE_COLORS,
} from "@/lib/evaluacion/engine";
import { getEngineCopy } from "@/lib/evaluacion/i18n";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";
import { BODY_PATH, BODY_ZONES } from "@/components/home/BodyFigureSVG";
import PdfDownload from "@/components/evaluacion/PdfDownload";
import ShareButton from "@/components/share/ShareButton";
import { trackEvent } from "@/lib/analytics";
import { openWhatsAppInApp } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/config";

// Compartir el enlace a la evaluación (no el PDF): que otra persona haga su
// test. Mismo bloque en el reporte scorable y en el no-scorable.
function ShareEvaluation({ locale }: { locale: Locale }) {
  const ui = getEvaluationUi(locale).result;
  return (
    <div className="mt-6 rounded-xl border border-primary/15 bg-primary-soft p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <p className="font-body text-sm text-ink/70">{ui.sharePrompt}</p>
      <div className="mt-3 sm:mt-0 sm:shrink-0">
        <ShareButton
          url={`${SITE_URL}${ui.shareUrlPath}`}
          title={ui.shareTitle}
          text={ui.shareText}
          variant="card"
          origen="reporte"
          label={ui.shareButtonLabel}
        />
      </div>
    </div>
  );
}

const BANNER_STYLES = {
  precaucion: { box: "border-warning bg-warning/10", title: "text-warning" },
  urgente: { box: "border-danger bg-danger/10", title: "text-danger" },
};

// Clase de la pill de nivel (el color no lo da el texto). El texto sale de ui.
const LEVEL_PILL: Record<NonUrgentLevel, string> = {
  leve: "bg-success/10 text-success",
  moderada: "bg-warning/10 text-warning",
  severa: "bg-danger/10 text-danger",
};

// Icono lucide por dominio y glifo de estado (SVG, nunca emoji). Cubre la
// tríada funcional y las dimensiones del COMI; Activity es el respaldo.
const DOMAIN_ICON: Record<DomainId, typeof Activity> = {
  basicas: Footprints,
  moderadas: Activity,
  demandantes: Dumbbell,
  dolor: Zap,
  actividades: Activity,
  bienestar: Heart,
};
const STATE_GLYPH: Record<DomainState, typeof Check> = {
  verde: Check,
  amarillo: Dot,
  naranja: MoreHorizontal,
  rojo: AlertCircle,
  na: Minus,
};

// Geometría del medidor semicircular.
function polar(score: number) {
  const angle = (180 - (score / 100) * 180) * (Math.PI / 180);
  return { x: 120 + 100 * Math.cos(angle), y: 120 - 100 * Math.sin(angle) };
}
function arc(a: number, b: number) {
  const p1 = polar(a);
  const p2 = polar(b);
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A 100 100 0 0 1 ${p2.x.toFixed(
    2
  )} ${p2.y.toFixed(2)}`;
}

function Gauge({
  score,
  ready,
  ariaLabel,
}: {
  score: number;
  ready: boolean;
  ariaLabel: string;
}) {
  const needleDeg = (score / 100) * 180 - 90;
  return (
    <svg viewBox="0 0 240 140" className="w-full max-w-[280px]" role="img"
      aria-label={ariaLabel}>
      <path d={arc(0, 30)} stroke="var(--color-success)" strokeWidth={16} fill="none" strokeLinecap="butt" />
      <path d={arc(30, 60)} stroke="var(--color-warning)" strokeWidth={16} fill="none" strokeLinecap="butt" />
      <path d={arc(60, 100)} stroke="var(--color-danger)" strokeWidth={16} fill="none" strokeLinecap="butt" />
      <g
        style={{
          transformBox: "view-box",
          transformOrigin: "120px 120px",
          transform: `rotate(${ready ? needleDeg : -90}deg)`,
          transition: "transform 800ms ease-out",
        }}
      >
        <line x1="120" y1="120" x2="120" y2="34" stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" />
      </g>
      <circle cx="120" cy="120" r="7" fill="var(--color-ink)" />
    </svg>
  );
}

// Mini-silueta de marca con la zona evaluada marcada en el color del nivel.
function MiniSilhouette({
  result,
  locale,
}: {
  result: EvaluationResult;
  locale: Locale;
}) {
  const pt = BODY_ZONES.find((z) => z.id === result.test.zoneId);
  const strong = NIVEL_BADGE_COLORS[result.level].strong;
  return (
    <svg
      viewBox="0 0 220 540"
      className="h-16 w-auto shrink-0"
      role="img"
      aria-label={getEvaluationUi(locale).result.zoneAria(result.zoneLabel)}
    >
      <path d={BODY_PATH} fill="var(--color-accent)" fillOpacity={0.12} />
      {pt && (
        <>
          <circle cx={pt.cx} cy={pt.cy} r={17} fill={strong} fillOpacity={0.2} />
          <circle cx={pt.cx} cy={pt.cy} r={8.5} fill={strong} />
        </>
      )}
    </svg>
  );
}

function CapacityCard({
  domain,
  locale,
}: {
  domain: ReturnType<typeof computeDomains>[number];
  locale: Locale;
}) {
  const { bg, strong } = FUNC_COLORS[domain.state];
  const Icon = DOMAIN_ICON[domain.id] ?? Activity;
  const Glyph = STATE_GLYPH[domain.state];
  return (
    <div
      className="relative overflow-hidden rounded-xl border-[1.5px] p-4 pl-5"
      style={{ backgroundColor: bg, borderColor: strong }}
    >
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: strong }}
        aria-hidden="true"
      />
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 shrink-0" style={{ color: strong }} strokeWidth={1.75} />
        <span className="font-heading text-sm font-bold text-ink">
          {domain.label}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full"
            style={{ backgroundColor: strong }}
          >
            <Glyph className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-body text-xs font-bold" style={{ color: strong }}>
            {getEngineCopy(locale).funcStateLabels[domain.state]}
          </span>
        </span>
      </div>
      <p className="mt-1 font-body text-xs italic text-ink/50">
        {domain.examples}
      </p>
      <p className="mt-1.5 font-body text-sm text-ink/80">{domain.fullPhrase}</p>
    </div>
  );
}

/** Encabezado común: mini-silueta + título + folio. */
function ResultHeader({
  result,
  locale,
}: {
  result: EvaluationResult;
  locale: Locale;
}) {
  const ui = getEvaluationUi(locale).result;
  return (
    <div className="flex items-center justify-center gap-3">
      <MiniSilhouette result={result} locale={locale} />
      <div className="text-left">
        <h1 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
          {ui.headerTitle(result.zoneLabel)}
        </h1>
        <p className="mt-1 font-body text-sm text-ink/50">
          {ui.folioLabel} {result.folio}
        </p>
      </div>
    </div>
  );
}

function AlertBanner({
  result,
  locale,
}: {
  result: EvaluationResult;
  locale: Locale;
}) {
  const banner = buildAlertBanner(result, locale);
  if (!banner) return null;
  return (
    <div
      className={`mt-6 rounded-r-xl border-l-4 p-4 ${
        BANNER_STYLES[banner.tone].box
      }`}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle
          className={`mt-0.5 h-5 w-5 shrink-0 ${BANNER_STYLES[banner.tone].title}`}
          strokeWidth={1.5}
        />
        <div>
          <p
            className={`font-heading font-bold ${BANNER_STYLES[banner.tone].title}`}
          >
            {banner.title}
          </p>
          <p className="mt-1 font-body text-sm text-ink/80">{banner.body}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Sin ítems puntuables no hay medidor, nivel ni semáforo: nada de eso existe.
 * Queda lo que sigue siendo cierto — la alerta si la hubo, las señales de la
 * zona y la puerta de contacto. Sin PDF: el reporte se articula sobre el score.
 */
function UnscorableScreen({
  result,
  locale,
}: {
  result: EvaluationResult;
  locale: Locale;
}) {
  const ui = getEvaluationUi(locale).result;
  const copy = getEngineCopy(locale);
  const warningSigns = getWarningSigns(result, locale);
  return (
    <div className="mx-auto w-full max-w-2xl">
      <ResultHeader result={result} locale={locale} />
      <AlertBanner result={result} locale={locale} />

      <div className="mt-6 rounded-xl border-[1.5px] border-ink/15 bg-ink/[0.03] p-5">
        <p className="font-body text-ink/80">{copy.unscorableMessage}</p>
      </div>

      {warningSigns.length > 0 && (
        <div className="mt-8 rounded-xl border-l-4 border-danger bg-danger/5 p-4">
          <h2 className="font-heading text-lg font-bold text-danger">
            {ui.warningTitle}
          </h2>
          <ul className="mt-3 space-y-2">
            {warningSigns.map((sign) => (
              <li key={sign} className="flex gap-2 font-body text-sm text-ink/80">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                  strokeWidth={1.75}
                />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-body text-sm font-semibold text-ink">
            {copy.warningClosing}
          </p>
        </div>
      )}

      <a
        href={getResultWhatsAppLink(result)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          trackEvent("whatsapp_click", { source_section: "evaluacion" });
          if (openWhatsAppInApp(getResultWhatsAppLink(result))) e.preventDefault();
        }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
        {result.alertLevel === "urgente" ? ui.ctaUrgent : ui.ctaNormal}
      </a>

      {/* Compartir la evaluación (secundario: no compite con el CTA de WhatsApp). */}
      <ShareEvaluation locale={locale} />

      <p className="mt-6 font-body text-xs text-ink/45">{ui.disclaimer}</p>
    </div>
  );
}

export default function ResultScreen({
  result,
  locale = "es",
}: {
  result: EvaluationResult;
  locale?: Locale;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Reporte mostrado: fin del embudo. Se registra en cuanto se monta el
  // resultado (scorable o no).
  useEffect(() => {
    trackEvent("evaluacion_completada", {
      zona: result.test.zoneId,
    });
  }, [result]);

  if (result.unscorable)
    return <UnscorableScreen result={result} locale={locale} />;

  const ui = getEvaluationUi(locale).result;
  const copy = getEngineCopy(locale);
  const rec = getRecommendation(result.level, result.alertLevel, locale);
  const recColors = getRecommendationColors(rec);
  const RecIcon = rec.urgent ? AlarmClock : CalendarClock;
  const whatsappLink = getResultWhatsAppLink(result);
  const paragraphs = result.test.reportTexts[result.level];
  const domains = computeDomains(result.test, result.answers, locale);
  const allGreen = allDomainsGreen(domains);
  const evaluationPlan = getEvaluationPlan(result, locale);
  const warningSigns = getWarningSigns(result, locale);
  const partialNote = getPartialAnswersNote(result, locale);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <ResultHeader result={result} locale={locale} />

      {/* Banner de alerta condicional (arriba del medidor) */}
      <AlertBanner result={result} locale={locale} />

      {/* Medidor + score */}
      <div className="mt-6 flex flex-col items-center">
        <Gauge score={result.score} ready={ready} ariaLabel={ui.gaugeAria(result.score)} />
        <p className="-mt-2 font-heading text-5xl font-extrabold text-primary">
          {result.score}
          <span className="text-2xl text-ink/50">{ui.per100}</span>
        </p>
        <p className="font-body text-sm text-ink/60">{ui.indexCaption}</p>
        <p className="mt-1 font-body text-xs text-ink/45">{ui.cutsLegend}</p>
        <span
          className={`mt-3 rounded-full px-4 py-1 font-body text-sm font-semibold ${LEVEL_PILL[result.level]}`}
        >
          {ui.levelPill[result.level]}
        </span>
        {partialNote && (
          <p className="mt-3 max-w-md text-center font-body text-xs text-ink/50">
            {partialNote}
          </p>
        )}
      </div>

      {/* Definición del nivel (badge, según el nivel funcional del score) */}
      <div
        className="mt-6 rounded-xl border-[1.5px] p-4"
        style={{
          backgroundColor: NIVEL_BADGE_COLORS[result.level].bg,
          borderColor: NIVEL_BADGE_COLORS[result.level].strong,
        }}
      >
        <p
          className="font-heading text-sm font-bold"
          style={{ color: NIVEL_BADGE_COLORS[result.level].strong }}
        >
          {ui.badgeQuestion(result.level)}
        </p>
        <p className="mt-1 font-body text-sm text-ink">
          {copy.nivelDefinitions[result.level]}
        </p>
      </div>

      {/* Semáforo: capacidad funcional o dimensiones, según el test */}
      {domains.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading text-lg font-bold text-primary">
            {getSemaphoreTitle(result.test, locale)}
          </h2>
          <div className="mt-4 space-y-3">
            {domains.map((domain) => (
              <CapacityCard key={domain.id} domain={domain} locale={locale} />
            ))}
          </div>
          {allGreen && (
            <p className="mt-3 font-body text-sm text-ink/70">
              {copy.funcAllGreenLine}
            </p>
          )}
        </div>
      )}

      {/* Qué significa tu resultado */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold text-primary">
          {ui.meaningTitle}
        </h2>
        <div className="mt-3 space-y-3 font-body text-ink/75">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Qué debe evaluarse en tu caso */}
      {evaluationPlan.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading text-lg font-bold text-primary">
            {ui.evalPlanTitle}
          </h2>
          <ul className="mt-3 space-y-2">
            {evaluationPlan.map((item) => (
              <li
                key={item}
                className="flex gap-2 font-body text-sm text-ink/80"
              >
                <Stethoscope
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  strokeWidth={1.75}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-body text-sm italic text-ink/60">
            {copy.evaluationSignature}
          </p>
        </div>
      )}

      {/* Señales para no esperar tu cita */}
      {warningSigns.length > 0 && (
        <div className="mt-8 rounded-xl border-l-4 border-danger bg-danger/5 p-4">
          <h2 className="font-heading text-lg font-bold text-danger">
            {ui.warningTitle}
          </h2>
          <ul className="mt-3 space-y-2">
            {warningSigns.map((sign) => (
              <li
                key={sign}
                className="flex gap-2 font-body text-sm text-ink/80"
              >
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                  strokeWidth={1.75}
                />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-body text-sm font-semibold text-ink">
            {copy.warningClosing}
          </p>
        </div>
      )}

      {/* Recomendación: cierre del recorrido. La ventana de tiempo es el
          titular; el color no marca severidad, solo urgencia. */}
      <div
        className="relative mt-8 overflow-hidden rounded-xl border-[1.5px] p-5 pl-6"
        style={{ backgroundColor: recColors.bg, borderColor: recColors.strong }}
      >
        <span
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ backgroundColor: recColors.strong }}
          aria-hidden="true"
        />
        <p
          className="font-body text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: recColors.strong }}
        >
          {rec.label}
        </p>
        <div className="mt-2 flex items-center gap-2.5">
          <RecIcon
            className="h-[18px] w-[18px] shrink-0"
            style={{ color: recColors.strong }}
            strokeWidth={1.75}
          />
          <p
            className="font-heading text-[17px] font-semibold leading-snug sm:text-lg"
            style={{ color: recColors.strong }}
          >
            {rec.window}
          </p>
        </div>
        <p className="mt-2.5 font-body text-sm text-ink">{rec.context}</p>
      </div>

      {/* CTA (con alertLevel 'urgente' cambia el mensaje). Gap reducido: la
          recomendación y el CTA se leen como una sola unidad de cierre. */}
      <div className="mt-5 space-y-3">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            trackEvent("whatsapp_click", { source_section: "evaluacion" });
            if (openWhatsAppInApp(whatsappLink)) e.preventDefault();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
          {result.alertLevel === "urgente" ? ui.ctaUrgent : ui.ctaNormal}
        </a>
        {result.alertLevel === "urgente" && (
          <p className="text-center font-body text-sm text-ink/70">
            {ui.urgentCarryNote}
          </p>
        )}
        <PdfDownload result={result} locale={locale} />
      </div>

      {/* Compartir la evaluación (secundario: no compite con el CTA de WhatsApp). */}
      <ShareEvaluation locale={locale} />

      <p className="mt-6 font-body text-xs text-ink/45">{ui.disclaimer}</p>
    </div>
  );
}
