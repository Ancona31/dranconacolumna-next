"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { TriageQuestion } from "@/lib/evaluacion/types";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";
import { IDLE, SELECTED } from "@/components/evaluacion/QuestionScreen";

/**
 * Resultado de responder una pregunta del triaje: ir a otra pregunta (con los
 * flags acumulados) o terminar el triaje y pasar al test.
 */
export type TriageOutcome =
  | { done: false; index: number; flags: string[] }
  | { done: true; flags: string[] };

type TriageScreenProps = {
  triage: TriageQuestion[];
  /** Pregunta activa y flags acumulados hasta ella (el estado vive en el flujo). */
  index: number;
  flags: string[];
  /** Avanza a otra pregunta del triaje o lo termina. */
  onAdvance: (outcome: TriageOutcome) => void;
  /** Pregunta anterior del triaje, o la pantalla de alarma desde la primera. */
  onBack: () => void;
  locale?: Locale;
};

/** Traduce la acción de una opción al siguiente paso del triaje. */
function resolveAction(
  action: string,
  triage: TriageQuestion[],
  index: number,
  flags: string[]
): TriageOutcome {
  /** Avanza a la siguiente pregunta por orden; si no hay, termina el triaje. */
  const advance = (nextFlags: string[]): TriageOutcome =>
    index + 1 >= triage.length
      ? { done: true, flags: nextFlags }
      : { done: false, index: index + 1, flags: nextFlags };

  // "flag-next:X" → registra el flag y avanza a la siguiente pregunta.
  if (action.startsWith("flag-next:")) {
    return advance([...flags, action.slice("flag-next:".length)]);
  }
  // "flag:X" → registra el flag y termina el triaje (rama terminal).
  if (action.startsWith("flag:")) {
    return { done: true, flags: [...flags, action.slice("flag:".length)] };
  }
  if (action.startsWith("goto:")) {
    const target = action.slice("goto:".length);
    const i = triage.findIndex((q) => q.id === target);
    return i < 0 ? { done: true, flags } : { done: false, index: i, flags };
  }
  // "next" → avanza a la siguiente pregunta sin registrar flag.
  if (action === "next") return advance(flags);
  // "continue" (o cualquier otro) → al test con los flags actuales.
  return { done: true, flags };
}

export default function TriageScreen({
  triage,
  index,
  flags,
  onAdvance,
  onBack,
  locale = "es",
}: TriageScreenProps) {
  const ui = getEvaluationUi(locale);
  const [picked, setPicked] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  // El avance pendiente muere con la pantalla (Atrás gana, como en el test).
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const question = triage[index];
  if (!question) return null;

  /** Mismo gesto que QuestionScreen: marca la opción 150 ms y avanza. */
  function choose(label: string, action: string) {
    if (picked !== null) return;
    setPicked(label);
    const outcome = resolveAction(action, triage, index, flags);
    timer.current = window.setTimeout(() => onAdvance(outcome), 150);
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
          {ui.question.back}
        </button>
        <span className="font-body text-sm tabular-nums text-muted">
          {ui.triage.eyebrow(index + 1, triage.length)}
        </span>
      </div>
      <h1 className="mt-1 font-heading text-2xl font-bold text-primary sm:text-3xl">
        {question.text}
      </h1>

      <ul className="mt-6 space-y-3">
        {question.options.map((opt) => {
          const active = picked === opt.label;
          return (
            <li key={opt.label}>
              <button
                type="button"
                onClick={() => choose(opt.label, opt.action)}
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
    </div>
  );
}
