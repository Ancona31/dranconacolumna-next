"use client";

import { useState } from "react";
import type { TriageQuestion } from "@/lib/evaluacion/types";

type TriageScreenProps = {
  triage: TriageQuestion[];
  /** Termina el triaje y pasa al test, con los flags acumulados. */
  onComplete: (flags: string[]) => void;
};

export default function TriageScreen({
  triage,
  onComplete,
}: TriageScreenProps) {
  const [currentId, setCurrentId] = useState(triage[0]?.id);
  const [flags, setFlags] = useState<string[]>([]);

  const question = triage.find((q) => q.id === currentId);
  if (!question) {
    onComplete(flags);
    return null;
  }

  function handleAction(action: string) {
    if (!question) return;
    if (action.startsWith("flag:")) {
      // Ningún flag interrumpe: se registra y sigue al test.
      onComplete([...flags, action.slice("flag:".length)]);
      return;
    }
    if (action.startsWith("goto:")) {
      setFlags(flags);
      setCurrentId(action.slice("goto:".length));
      return;
    }
    // "continue" (o cualquier otro) → al test con los flags actuales.
    onComplete(flags);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
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
