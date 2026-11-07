"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { TestQuestion } from "@/lib/evaluacion/types";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";

/** Opción "No aplica" del FAAM: la respuesta es null y el ítem sale del cálculo. */
const NA = "na" as const;

/**
 * Elegida ≠ hover: el hover solo tiñe (primary-soft); la elegida se llena de
 * primary con texto blanco (11.1:1) y se sostiene 150 ms antes de avanzar.
 * Compartidas con el triaje para que el mismo gesto se vea igual.
 */
export const SELECTED = "border-primary bg-primary text-white";
export const IDLE =
  "border-ink/15 bg-background text-ink hover:border-accent hover:bg-primary-soft";

type QuestionScreenProps = {
  question: TestQuestion;
  index: number;
  total: number;
  /** Sustantivo del ítem capitalizado ("Pregunta" / "Frase"). */
  nounLabel: string;
  timeLabel: string;
  /** Fragmento de zona del "No aplica" (solo tests con allowNA, p. ej. tobillo). */
  naZoneFragment?: string;
  /**
   * Respuesta de la pregunta `questionId`; `null` = el paciente marcó "No
   * aplica". El id viaja con el valor para que una respuesta tardía nunca
   * quede guardada en otra pregunta.
   */
  onAnswer: (questionId: string, value: number | null) => void;
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

  // El auto-avance pendiente muere con la pantalla: si el usuario sale antes
  // de los 150 ms (Atrás, gesto del sistema), su acción gana.
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  function choose(value: number | typeof NA) {
    if (picked !== null) return;
    setPicked(value);
    // Marca visual breve (150 ms) y auto-avance.
    timer.current = window.setTimeout(
      () => onAnswer(question.id, value === NA ? null : value),
      150
    );
  }

  function back() {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    onBack();
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          className="-ml-3 inline-flex min-h-11 items-center gap-1 px-2 font-body text-sm text-muted transition-[transform,color] duration-150 ease-out hover:text-accent active:scale-[0.97]"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          {ui.back}
        </button>
        <span className="font-body text-sm tabular-nums text-muted">
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
          {/* Escala 0-10, alto táctil ≥48px. En pantallas angostas va en dos
              filas (0-5 y 6-10): 11 columnas a 320px dejan botones de ~22px.
              La segunda fila arranca en la columna 2 para que el 10 quede en
              el borde derecho, bajo su etiqueta; la del 0 sube sobre la
              primera fila, junto a él. */}
          {question.anchors && (
            <p className="mb-2 font-body text-xs text-muted sm:hidden">
              {question.anchors.min}
            </p>
          )}
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-11 sm:gap-1.5">
            {Array.from({ length: 11 }, (_, value) => {
              const active = picked === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => choose(value)}
                  aria-label={`${value}`}
                  aria-pressed={active}
                  className={`flex min-h-12 items-center justify-center rounded-lg border font-body text-sm font-semibold tabular-nums transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] sm:text-base ${
                    value === 6 ? "col-start-2 sm:col-start-auto" : ""
                  } ${active ? SELECTED : IDLE}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
          {question.anchors && (
            <div className="mt-2 flex justify-end font-body text-xs text-muted sm:justify-between">
              <span className="max-sm:hidden">{question.anchors.min}</span>
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
                    aria-pressed={active}
                    className={`w-full rounded-2xl border p-4 text-left font-body text-lg font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.98] ${
                      active ? SELECTED : IDLE
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
              aria-pressed={picked === NA}
              className={`mt-4 w-full rounded-xl border border-dashed p-3 text-left font-body text-sm transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.98] ${
                picked === NA
                  ? SELECTED
                  : "border-ink/25 bg-transparent text-muted hover:border-accent hover:text-accent"
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
