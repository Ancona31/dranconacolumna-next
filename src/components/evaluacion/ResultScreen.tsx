"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, MessageCircle, ShieldCheck } from "lucide-react";
import type { EvaluationResult, NonUrgentLevel } from "@/lib/evaluacion/types";
import {
  buildAlertBanner,
  getRecommendationText,
  getResultWhatsAppLink,
} from "@/lib/evaluacion/engine";
import PdfDownload from "@/components/evaluacion/PdfDownload";

const BANNER_STYLES = {
  precaucion: {
    box: "border-warning bg-warning/10",
    title: "text-warning",
  },
  urgente: {
    box: "border-danger bg-danger/10",
    title: "text-danger",
  },
};

const LEVEL_STYLES: Record<
  NonUrgentLevel,
  { pill: string; border: string; label: string; gauge: string }
> = {
  leve: {
    pill: "bg-success/10 text-success",
    border: "border-success",
    label: "Limitación leve",
    gauge: "var(--color-success)",
  },
  moderada: {
    pill: "bg-warning/10 text-warning",
    border: "border-warning",
    label: "Limitación moderada",
    gauge: "var(--color-warning)",
  },
  severa: {
    pill: "bg-danger/10 text-danger",
    border: "border-danger",
    label: "Limitación severa",
    gauge: "var(--color-danger)",
  },
};

const BUCKETS = {
  leve: { label: "Leve", bar: "bg-success", text: "text-success" },
  moderado: { label: "Moderado", bar: "bg-warning", text: "text-warning" },
  alto: { label: "Alto", bar: "bg-danger", text: "text-danger" },
};

function bucketFor(value: number) {
  if (value <= 1) return BUCKETS.leve;
  if (value === 2) return BUCKETS.moderado;
  return BUCKETS.alto;
}

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

function Gauge({ score, ready }: { score: number; ready: boolean }) {
  const needleDeg = (score / 100) * 180 - 90;
  return (
    <svg viewBox="0 0 240 140" className="w-full max-w-[280px]" role="img"
      aria-label={`Índice de limitación ${score} de 100`}>
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

export default function ResultScreen({ result }: { result: EvaluationResult }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const style = LEVEL_STYLES[result.level];
  const whatsappLink = getResultWhatsAppLink(result);
  const sorted = [...result.breakdown].sort((a, b) => b.value - a.value);
  const paragraphs = result.test.reportTexts[result.level];
  const banner = buildAlertBanner(result);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="text-center font-heading text-2xl font-bold text-primary sm:text-3xl">
        Tu evaluación de {result.zoneLabel}
      </h1>
      <p className="mt-1 text-center font-body text-sm text-ink/50">
        Folio {result.folio}
      </p>

      {/* Banner de alerta condicional (arriba del medidor) */}
      {banner && (
        <div
          className={`mt-6 rounded-r-xl border-l-4 p-4 ${
            BANNER_STYLES[banner.tone].box
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                BANNER_STYLES[banner.tone].title
              }`}
              strokeWidth={1.5}
            />
            <div>
              <p
                className={`font-heading font-bold ${
                  BANNER_STYLES[banner.tone].title
                }`}
              >
                {banner.title}
              </p>
              <p className="mt-1 font-body text-sm text-ink/80">
                {banner.body}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Medidor + score */}
      <div className="mt-6 flex flex-col items-center">
        <Gauge score={result.score} ready={ready} />
        <p className="-mt-2 font-heading text-5xl font-extrabold text-primary">
          {result.score}
          <span className="text-2xl text-ink/50">/100</span>
        </p>
        <p className="font-body text-sm text-ink/60">índice de limitación</p>
        <p className="mt-1 font-body text-xs text-ink/45">
          0–30 leve · 31–60 moderada · 61–100 severa
        </p>
        <span
          className={`mt-3 rounded-full px-4 py-1 font-body text-sm font-semibold ${style.pill}`}
        >
          {style.label}
        </span>
      </div>

      {/* Recomendación */}
      <div
        className={`mt-8 rounded-r-xl border-l-4 bg-primary-soft/60 p-4 ${style.border}`}
      >
        <p className="font-body text-ink/80">
          {getRecommendationText(result.level, result.alertLevel)}
        </p>
      </div>

      {/* Áreas más afectadas */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold text-primary">
          Áreas más afectadas
        </h2>
        <ul className="mt-4 space-y-3">
          {sorted.map((item, i) => {
            const bucket = bucketFor(item.value);
            return (
              <li key={item.shortLabel}>
                <div className="flex items-center justify-between font-body text-sm">
                  <span className="text-ink/80">{item.shortLabel}</span>
                  <span className={`font-semibold ${bucket.text}`}>
                    {bucket.label}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={`h-full origin-left rounded-full transition-transform duration-500 ease-out ${bucket.bar}`}
                    style={{
                      transform: `scaleX(${ready ? Math.max(item.value / 4, 0.04) : 0})`,
                      transitionDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Qué significa tu resultado */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold text-primary">
          Qué significa tu resultado
        </h2>
        <div className="mt-3 space-y-3 font-body text-ink/75">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Línea de alarma: solo cuando no hay datos marcados */}
      {result.alertLevel === "none" && (
        <div className="mt-6 flex items-center gap-2 font-body text-sm text-ink/70">
          <ShieldCheck
            className="h-5 w-5 shrink-0 text-success"
            strokeWidth={1.5}
          />
          No se identificaron datos de alarma en tus respuestas
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 space-y-3">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985]"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
          Escríbenos para agendar tu valoración
        </a>
        <PdfDownload result={result} />
      </div>

      <p className="mt-6 font-body text-xs text-ink/45">
        Esta evaluación es orientativa y no sustituye una consulta médica. Tus
        respuestas no salen de tu dispositivo.
      </p>
    </div>
  );
}
