"use client";

import { useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { TestQuestion } from "@/lib/evaluacion/types";

type QuestionScreenProps = {
  question: TestQuestion;
  index: number;
  total: number;
  timeLabel: string;
  onAnswer: (value: number) => void;
  onBack: () => void;
};

export default function QuestionScreen({
  question,
  index,
  total,
  timeLabel,
  onAnswer,
  onBack,
}: QuestionScreenProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  function choose(value: number) {
    if (picked !== null) return;
    setPicked(value);
    // Marca visual breve y auto-avance.
    timer.current = window.setTimeout(() => onAnswer(value), 150);
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
          Atrás
        </button>
        <span className="font-body text-sm text-ink/60">
          Pregunta {index + 1} de {total} · {timeLabel}
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

      <ul className="mt-6 space-y-3">
        {question.options.map((opt) => {
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
    </div>
  );
}
