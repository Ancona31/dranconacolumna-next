"use client";

import { useEffect, useState } from "react";
import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import { trackEvent } from "@/lib/analytics";
import type {
  AnswerMap,
  EvaluationResult,
  TestDefinition,
} from "@/lib/evaluacion/types";
import { computeResult } from "@/lib/evaluacion/engine";
import { TESTS, AVAILABLE_ZONES } from "@/lib/evaluacion/tests";
import ZonePicker from "@/components/evaluacion/ZonePicker";
import AlarmScreen from "@/components/evaluacion/AlarmScreen";
import TriageScreen from "@/components/evaluacion/TriageScreen";
import QuestionScreen from "@/components/evaluacion/QuestionScreen";
import ResultScreen from "@/components/evaluacion/ResultScreen";

type Step = "zona" | "alarma" | "triaje" | "test" | "resultado";

function timeLabel(test: TestDefinition) {
  return test.estimatedMinutes <= 1
    ? "menos de 1 min"
    : `~${test.estimatedMinutes} min`;
}

/** Sustantivo del ítem, con mayúscula inicial ("Pregunta" / "Frase"). */
function questionNounCap(test: TestDefinition) {
  const singular = test.questionNoun?.singular ?? "pregunta";
  return singular.charAt(0).toUpperCase() + singular.slice(1);
}

export default function EvaluationFlow({
  initialZone,
}: {
  initialZone?: BodyZoneId;
}) {
  const startTest =
    initialZone && TESTS[initialZone]
      ? TESTS[initialZone]!
      : null;

  const [step, setStep] = useState<Step>(startTest ? "alarma" : "zona");
  const [test, setTest] = useState<TestDefinition | null>(startTest);
  const [alarmFlags, setAlarmFlags] = useState<string[]>([]);
  const [triageFlags, setTriageFlags] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);

  // Entrada por deep-link (?zona=): el flujo arranca solo, sin pasar por el
  // ZonePicker, así que el inicio se registra aquí al montar.
  useEffect(() => {
    if (startTest) {
      trackEvent("evaluacion_iniciada", { zona: startTest.zoneId });
    }
    // Solo al montar: startTest se fija una vez desde initialZone.
  }, [startTest]);

  function reset() {
    setStep("zona");
    setTest(null);
    setAlarmFlags([]);
    setTriageFlags([]);
    setQIndex(0);
    setAnswers({});
    setResult(null);
  }

  function handleZoneSelect(zoneId: BodyZoneId) {
    const t = TESTS[zoneId];
    if (!t) return;
    trackEvent("evaluacion_iniciada", { zona: zoneId });
    setTest(t);
    setAlarmFlags([]);
    setTriageFlags([]);
    setAnswers({});
    setQIndex(0);
    setStep("alarma");
  }

  function handleAlarmContinue(flagIds: string[]) {
    setAlarmFlags(flagIds);
    setStep("triaje");
  }

  function handleTriageComplete(flags: string[]) {
    setTriageFlags(flags);
    setQIndex(0);
    setStep("test");
  }

  /** `value` es null cuando el paciente marcó "No aplica". */
  function handleAnswer(value: number | null) {
    if (!test) return;
    const q = test.questions[qIndex];
    const nextAnswers = { ...answers, [q.id]: value };
    setAnswers(nextAnswers);
    if (qIndex + 1 >= test.questions.length) {
      setResult(
        computeResult(test, nextAnswers, [...alarmFlags, ...triageFlags])
      );
      setStep("resultado");
    } else {
      setQIndex(qIndex + 1);
    }
  }

  function handleBack() {
    if (qIndex > 0) setQIndex(qIndex - 1);
    else setStep("triaje");
  }

  const total = test?.questions.length ?? 0;
  const progress = (() => {
    switch (step) {
      case "zona":
        return 0.04;
      case "alarma":
        return 0.12;
      case "triaje":
        return 0.2;
      case "test":
        return 0.3 + (total ? (qIndex / total) * 0.6 : 0);
      default:
        return 1;
    }
  })();

  // La selección de zona vive en la página (con header del sitio).
  if (step === "zona") {
    return (
      <section className="px-4 py-12 md:py-16">
        <div key="zona" className="eval-screen">
          <ZonePicker
            availableZones={AVAILABLE_ZONES}
            onSelect={handleZoneSelect}
          />
        </div>
      </section>
    );
  }

  // El resto del flujo toma toda la pantalla para dar foco total.
  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-background">
      <div className="h-1 w-full shrink-0 bg-ink/10">
        <div
          className="h-full origin-left bg-accent transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-2xl items-center justify-end px-4 pt-3">
        <button
          type="button"
          onClick={reset}
          className="font-body text-sm text-ink/50 transition-colors duration-150 hover:text-ink"
        >
          Salir
        </button>
      </div>

      <div
        key={`${step}-${qIndex}`}
        className="eval-screen flex-1 px-4 py-8 sm:py-10"
      >
        {step === "alarma" && test && (
          <AlarmScreen test={test} onContinue={handleAlarmContinue} />
        )}

        {step === "triaje" && test && (
          <TriageScreen
            triage={test.triage}
            onComplete={handleTriageComplete}
          />
        )}

        {step === "test" && test && (
          <QuestionScreen
            question={test.questions[qIndex]}
            index={qIndex}
            total={total}
            nounLabel={questionNounCap(test)}
            timeLabel={timeLabel(test)}
            onAnswer={handleAnswer}
            onBack={handleBack}
          />
        )}

        {step === "resultado" && result && <ResultScreen result={result} />}
      </div>
    </div>
  );
}
