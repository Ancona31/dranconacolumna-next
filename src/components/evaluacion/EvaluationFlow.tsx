"use client";

import { useEffect, useRef, useState } from "react";
import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import { trackEvent } from "@/lib/analytics";
import type {
  AnswerMap,
  EvaluationResult,
  TestDefinition,
} from "@/lib/evaluacion/types";
import { computeResult } from "@/lib/evaluacion/engine";
import { getTest, AVAILABLE_ZONES } from "@/lib/evaluacion/tests";
import type { Locale } from "@/lib/i18n/types";
import {
  getEvaluationUi,
  type EvaluationUi,
} from "@/lib/i18n/pages/evaluacion";
import ZonePicker from "@/components/evaluacion/ZonePicker";
import AlarmScreen from "@/components/evaluacion/AlarmScreen";
import TriageScreen from "@/components/evaluacion/TriageScreen";
import QuestionScreen from "@/components/evaluacion/QuestionScreen";
import ResultScreen from "@/components/evaluacion/ResultScreen";

type Step = "zona" | "alarma" | "triaje" | "test" | "resultado";

/** id que recibe el h1 de la pantalla activa; nombra al diálogo. */
const SCREEN_TITLE_ID = "eval-screen-title";

/** Confirmación al salir con avance: las respuestas no se guardan. */
const EXIT_CONFIRM: Record<Locale, string> = {
  es: "¿Salir de la evaluación? Se perderán tus respuestas.",
  en: "Leave the assessment? Your answers will be lost.",
};

function timeLabel(test: TestDefinition, ui: EvaluationUi) {
  return test.estimatedMinutes <= 1
    ? ui.flow.timeUnder1
    : ui.flow.timeApprox(test.estimatedMinutes);
}

/** Sustantivo del ítem, con mayúscula inicial ("Pregunta" / "Frase"). */
function questionNounCap(test: TestDefinition, ui: EvaluationUi) {
  const singular = test.questionNoun?.singular ?? ui.alarm.nounFallbackSingular;
  return singular.charAt(0).toUpperCase() + singular.slice(1);
}

export default function EvaluationFlow({
  initialZone,
  locale = "es",
}: {
  initialZone?: BodyZoneId;
  locale?: Locale;
}) {
  const ui = getEvaluationUi(locale);
  const startTest = initialZone ? getTest(initialZone, locale) : null;

  const [step, setStep] = useState<Step>(startTest ? "alarma" : "zona");
  const [test, setTest] = useState<TestDefinition | null>(startTest);
  const [alarmFlags, setAlarmFlags] = useState<string[]>([]);
  const [triageFlags, setTriageFlags] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);
  // Sentido de la navegación: la pantalla nueva llega desde el lado hacia el
  // que se avanza (derecha) o se retrocede (izquierda).
  const [direction, setDirection] = useState<1 | -1>(1);
  const screenRef = useRef<HTMLDivElement>(null);
  const overlay = step !== "zona";

  // Entrada por deep-link (?zona=): el flujo arranca solo, sin pasar por el
  // ZonePicker, así que el inicio se registra aquí al montar.
  useEffect(() => {
    if (startTest) {
      trackEvent("evaluacion_iniciada", { zona: startTest.zoneId });
    }
    // Solo al montar: startTest se fija una vez desde initialZone.
  }, [startTest]);

  // Cada pantalla nueva recibe el foco en su h1: el lector de pantalla la
  // anuncia y el teclado no queda perdido en el <body> tras el re-montaje.
  useEffect(() => {
    if (!overlay) return;
    const h1 = screenRef.current?.querySelector("h1");
    if (!h1) return;
    h1.id = SCREEN_TITLE_ID;
    h1.tabIndex = -1;
    h1.focus({ preventScroll: true });
  }, [overlay, step, qIndex]);

  // Mientras el flujo cubre la pantalla, la página de atrás no se desplaza.
  // position: fixed (y no solo overflow: hidden) porque iOS Safari ignora el
  // overflow del body; se restaura el scroll guardado al cerrar.
  useEffect(() => {
    if (!overlay) return;
    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      // instant: el scroll suave global animaría el regreso a la posición.
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [overlay]);

  function reset() {
    setDirection(-1);
    setStep("zona");
    setTest(null);
    setAlarmFlags([]);
    setTriageFlags([]);
    setQIndex(0);
    setAnswers({});
    setResult(null);
  }

  function handleZoneSelect(zoneId: BodyZoneId) {
    const t = getTest(zoneId, locale);
    if (!t) return;
    trackEvent("evaluacion_iniciada", { zona: zoneId });
    setTest(t);
    setAlarmFlags([]);
    setTriageFlags([]);
    setAnswers({});
    setQIndex(0);
    setDirection(1);
    setStep("alarma");
  }

  function handleAlarmContinue(flagIds: string[]) {
    setAlarmFlags(flagIds);
    setDirection(1);
    setStep("triaje");
  }

  function handleTriageComplete(flags: string[]) {
    setTriageFlags(flags);
    setQIndex(0);
    setDirection(1);
    setStep("test");
  }

  /** `value` es null cuando el paciente marcó "No aplica". */
  function handleAnswer(value: number | null) {
    if (!test) return;
    const q = test.questions[qIndex];
    const nextAnswers = { ...answers, [q.id]: value };
    setAnswers(nextAnswers);
    setDirection(1);
    if (qIndex + 1 >= test.questions.length) {
      setResult(
        computeResult(test, nextAnswers, [...alarmFlags, ...triageFlags], locale)
      );
      setStep("resultado");
    } else {
      setQIndex(qIndex + 1);
    }
  }

  function handleBack() {
    setDirection(-1);
    if (qIndex > 0) setQIndex(qIndex - 1);
    else setStep("triaje");
  }

  /** Desde el triaje en adelante hay avance que se perdería: se confirma. */
  function handleExit() {
    if (step !== "alarma" && !window.confirm(EXIT_CONFIRM[locale])) return;
    reset();
  }

  const screenStyle = {
    "--eval-dx": `${direction * 10}px`,
  } as React.CSSProperties;

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
        <div key="zona" className="eval-screen" style={screenStyle}>
          <ZonePicker
            availableZones={AVAILABLE_ZONES}
            onSelect={handleZoneSelect}
            locale={locale}
          />
        </div>
      </section>
    );
  }

  // El resto del flujo toma toda la pantalla para dar foco total.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={SCREEN_TITLE_ID}
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="h-1 w-full shrink-0 bg-ink/10">
        <div
          className="h-full origin-left bg-accent transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-2xl items-center justify-end px-4 pt-1">
        <button
          type="button"
          onClick={handleExit}
          className="-mr-3 inline-flex min-h-11 items-center px-3 font-body text-sm text-muted transition-[transform,color] duration-150 ease-out hover:text-ink active:scale-[0.97]"
        >
          {ui.flow.exit}
        </button>
      </div>

      <div
        ref={screenRef}
        key={`${step}-${qIndex}`}
        className="eval-screen flex-1 px-4 py-8 sm:py-10 [&_h1:focus]:outline-none"
        style={screenStyle}
      >
        {step === "alarma" && test && (
          <AlarmScreen
            test={test}
            onContinue={handleAlarmContinue}
            locale={locale}
          />
        )}

        {step === "triaje" && test && (
          <TriageScreen
            triage={test.triage}
            onComplete={handleTriageComplete}
            locale={locale}
          />
        )}

        {step === "test" && test && (
          <QuestionScreen
            question={test.questions[qIndex]}
            index={qIndex}
            total={total}
            nounLabel={questionNounCap(test, ui)}
            timeLabel={timeLabel(test, ui)}
            naZoneFragment={test.naZoneFragment}
            onAnswer={handleAnswer}
            onBack={handleBack}
            locale={locale}
          />
        )}

        {step === "resultado" && result && (
          <ResultScreen result={result} locale={locale} />
        )}
      </div>
    </div>
  );
}
