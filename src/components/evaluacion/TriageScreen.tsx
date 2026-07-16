"use client";

import { useState } from "react";
import type { TriageQuestion } from "@/lib/evaluacion/types";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";

type TriageScreenProps = {
  triage: TriageQuestion[];
  /** Termina el triaje y pasa al test, con los flags acumulados. */
  onComplete: (flags: string[]) => void;
  locale?: Locale;
};

export default function TriageScreen({
  triage,
  onComplete,
  locale = "es",
}: TriageScreenProps) {
  const ui = getEvaluationUi(locale).triage;
  const [index, setIndex] = useState(0);
  const [flags, setFlags] = useState<string[]>([]);

  const question = triage[index];
  if (!question) {
    onComplete(flags);
    return null;
  }

  /** Avanza a la siguiente pregunta por orden; si no hay, termina el triaje. */
  function advance(nextFlags: string[]) {
    const next = index + 1;
    if (next >= triage.length) onComplete(nextFlags);
    else {
      setFlags(nextFlags);
      setIndex(next);
    }
  }

  function handleAction(action: string) {
    if (!question) return;
    // "flag-next:X" → registra el flag y avanza a la siguiente pregunta.
    if (action.startsWith("flag-next:")) {
      advance([...flags, action.slice("flag-next:".length)]);
      return;
    }
    // "flag:X" → registra el flag y termina el triaje (rama terminal).
    if (action.startsWith("flag:")) {
      onComplete([...flags, action.slice("flag:".length)]);
      return;
    }
    if (action.startsWith("goto:")) {
      const target = action.slice("goto:".length);
      const i = triage.findIndex((q) => q.id === target);
      if (i < 0) onComplete(flags);
      else setIndex(i);
      return;
    }
    // "next" → avanza a la siguiente pregunta sin registrar flag.
    if (action === "next") {
      advance(flags);
      return;
    }
    // "continue" (o cualquier otro) → al test con los flags actuales.
    onComplete(flags);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <span className="font-body text-sm text-ink/60">
        {ui.eyebrow(index + 1, triage.length)}
      </span>
      <h1 className="mt-1 font-heading text-2xl font-bold text-primary sm:text-3xl">
        {question.text}
      </h1>

      <ul className="mt-6 space-y-3">
        {question.options.map((opt) => (
          <li key={opt.label}>
            <button
              type="button"
              onClick={() => handleAction(opt.action)}
              className="w-full rounded-2xl border border-ink/15 bg-background p-4 text-left font-body text-lg font-medium text-ink transition duration-150 hover:border-accent hover:bg-primary-soft active:scale-[0.99]"
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
