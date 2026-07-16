"use client";

import { useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { TestQuestion } from "@/lib/evaluacion/types";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";

/** Opción "No aplica" del FAAM: la respuesta es null y el ítem sale del cálculo. */
const NA = "na" as const;

type QuestionScreenProps = {
  question: TestQuestion;
  index: number;
  total: number;
  /** Sustantivo del ítem capitalizado ("Pregunta" / "Frase"). */
  nounLabel: string;
  timeLabel: string;
  /** Fragmento de zona del "No aplica" (solo tests con allowNA, p. ej. tobillo). */
  naZoneFragment?: string;
  /** `null` = el paciente marcó "No aplica". */
  onAnswer: (value: number | null) => void;
  onBack: () => void;
  locale?: Locale;
};

export default function QuestionScreen({
  question,
  index,
  total,
  nounLabel,
  timeLabel,
  naZoneFragment,
  onAnswer,
  onBack,
  locale = "es",
}: QuestionScreenProps) {
  const ui = getEvaluationUi(locale).question;
  const [picked, setPicked] = useState<number | typeof NA | null>(null);
  const timer = useRef<number | null>(null);

  function choose(value: number | typeof NA) {
    if (picked !== null) return;
    setPicked(value);
    // Marca visual breve y auto-avance.
    timer.current = window.setTimeout(
      () => onAnswer(value === NA ? null : value),
      150
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 inline-flex items-center gap-1 font-body text-sm text-ink/60 transition-colors duration-150 hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          {ui.back}
        </button>
        <span className="font-body text-sm text-ink/60">
          {ui.header(nounLabel, index + 1, total, timeLabel)}
        </span>
      </div>

      {question.contextHeader && (
        <p className="mt-6 font-body text-sm font-medium text-accent">
          {question.contextHeader}
        </p>
      )}
      <h1 className="mt-1 font-heading text-2xl font-bold text-primary sm:text-3xl">
        {question.text}
      </h1>

      {question.kind === "scale" ? (
        <div className="mt-6">
          {/* Escala 0-10: 11 botones de ancho uniforme, alto táctil ≥48px. */}
          <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
            {Array.from({ length: 11 }, (_, value) => {
              const active = picked === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => choose(value)}
                  aria-label={`${value}`}
                  className={`flex min-h-12 items-center justify-center rounded-lg border font-body text-sm font-semibold tabular-nums transition duration-150 active:scale-[0.97] sm:text-base ${
                    active
                      ? "border-accent bg-primary-soft text-primary"
                      : "border-ink/15 bg-background text-ink hover:border-accent hover:bg-primary-soft"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
          {question.anchors && (
            <div className="mt-2 flex justify-between font-body text-xs text-ink/50">
              <span>{question.anchors.min}</span>
              <span className="text-right">{question.anchors.max}</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {(question.options ?? []).map((opt) => {
              const active = picked === opt.value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => choose(opt.value)}
                    className={`w-full rounded-2xl border p-4 text-left font-body text-lg font-medium transition duration-150 active:scale-[0.99] ${
                      active
                        ? "border-accent bg-primary-soft text-primary"
                        : "border-ink/15 bg-background text-ink hover:border-accent hover:bg-primary-soft"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Salida discreta: nunca compite con las cinco opciones puntuables. */}
          {question.allowNA && (
            <button
              type="button"
              onClick={() => choose(NA)}
              className={`mt-4 w-full rounded-xl border border-dashed p-3 text-left font-body text-sm transition duration-150 active:scale-[0.99] ${
                picked === NA
                  ? "border-accent bg-primary-soft text-primary"
                  : "border-ink/25 bg-transparent text-ink/60 hover:border-accent hover:text-accent"
              }`}
            >
              {`${ui.naLead}${naZoneFragment ?? ""}`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
