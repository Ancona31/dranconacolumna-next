"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { RED_FLAGS, RED_FLAG_NONE_ID } from "@/lib/evaluacion/red-flags";
import { getEngineCopy } from "@/lib/evaluacion/i18n";
import type { TestDefinition } from "@/lib/evaluacion/types";
import type { Locale } from "@/lib/i18n/types";
import {
  getEvaluationUi,
  type EvaluationUi,
} from "@/lib/i18n/pages/evaluacion";

type AlarmScreenProps = {
  /** Test en curso; provee el conteo de ítems y la duración estimada. */
  test: TestDefinition;
  /**
   * Continúa SIEMPRE al triaje/test. Recibe los ids de los datos de alarma
   * marcados (vacío si eligió "Ninguna"). Ningún flag interrumpe el test.
   */
  onContinue: (flagIds: string[]) => void;
  locale?: Locale;
};

/** "24 frases · alrededor de 2 minutos" — conteo de ítems + duración. */
function durationLabel(test: TestDefinition, ui: EvaluationUi) {
  const noun =
    test.questionNoun?.plural ??
    (test.questions.length === 1
      ? ui.alarm.nounFallbackSingular
      : ui.alarm.nounFallbackPlural);
  const time = ui.alarm.durationApprox(test.estimatedMinutes);
  return ui.alarm.durationJoin(test.questions.length, noun, time);
}

export default function AlarmScreen({
  test,
  onContinue,
  locale = "es",
}: AlarmScreenProps) {
  const ui = getEvaluationUi(locale);
  const copy = getEngineCopy(locale);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      if (id === RED_FLAG_NONE_ID) {
        // "Ninguna" es exclusiva.
        return prev.has(RED_FLAG_NONE_ID)
          ? new Set()
          : new Set([RED_FLAG_NONE_ID]);
      }
      const next = new Set(prev);
      // Seleccionar cualquier otra limpia "Ninguna".
      next.delete(RED_FLAG_NONE_ID);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const hasSelection = selected.size > 0;

  function handleContinue() {
    const flagIds = RED_FLAGS.filter((f) => selected.has(f.id)).map((f) => f.id);
    onContinue(flagIds);
  }

  const items = [
    ...RED_FLAGS.map((f) => ({ id: f.id, label: copy.redFlagLabels[f.id] })),
    { id: RED_FLAG_NONE_ID, label: copy.redFlagNoneLabel },
  ];

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
        {ui.alarm.h1}
      </h1>
      <p className="mt-2 font-body text-ink/70">{ui.alarm.subtitle}</p>
      <p className="mt-1 font-body text-sm text-ink/50">
        {durationLabel(test, ui)}
      </p>

      {test.instructions && (
        <p className="mt-4 rounded-xl border border-ink/10 bg-primary-soft/40 p-3 font-body text-sm text-ink/70">
          {test.instructions}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {items.map((item) => {
          const active = selected.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={active}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left font-body transition duration-150 active:scale-[0.99] ${
                  active
                    ? "border-accent bg-primary-soft text-ink"
                    : "border-ink/15 bg-background text-ink/80 hover:border-accent/60"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-ink/25"
                  }`}
                >
                  {active && <Check className="h-4 w-4" strokeWidth={2.5} />}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!hasSelection}
        className="mt-6 w-full rounded-full bg-primary px-6 py-4 font-body text-base font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {ui.alarm.continue}
      </button>
    </div>
  );
}
