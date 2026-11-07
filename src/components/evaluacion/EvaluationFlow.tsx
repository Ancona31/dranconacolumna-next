"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import type { BodyZoneId } from "@/components/home/BodyFigureSVG";
import { trackEvent } from "@/lib/analytics";
import type { AnswerMap, TestDefinition } from "@/lib/evaluacion/types";
import { buildFolio, computeResult } from "@/lib/evaluacion/engine";
import { getTest, AVAILABLE_ZONES } from "@/lib/evaluacion/tests";
import type { Locale } from "@/lib/i18n/types";
import {
  getEvaluationUi,
  type EvaluationUi,
} from "@/lib/i18n/pages/evaluacion";
import ZonePicker from "@/components/evaluacion/ZonePicker";
import AlarmScreen from "@/components/evaluacion/AlarmScreen";
import TriageScreen, {
  type TriageOutcome,
} from "@/components/evaluacion/TriageScreen";
import QuestionScreen from "@/components/evaluacion/QuestionScreen";
import ResultScreen from "@/components/evaluacion/ResultScreen";

/**
 * Una pantalla del flujo. El recorrido es una pila (`trail`): avanzar apila,
 * Atrás desapila. Cada pantalla apilada tiene su entrada en el historial del
 * navegador, así el Atrás del sistema retrocede un paso en vez de sacar de la
 * página.
 */
type Position =
  | { step: "alarma" }
  | { step: "triaje"; index: number; flags: string[] }
  | { step: "test"; qIndex: number }
  | { step: "resultado" };

type FlowState = {
  zone: BodyZoneId | null;
  /** Pantallas recorridas; la última es la activa. Vacía = selector de zona. */
  trail: Position[];
  /**
   * true si el flujo arrancó en el selector: debajo de la primera pantalla
   * está el selector (misma página). false con entrada directa (?zona=):
   * debajo está la página de la que vino el usuario.
   */
  fromPicker: boolean;
  alarmFlags: string[];
  /** Flags con los que terminó el triaje. */
  triageFlags: string[];
  answers: AnswerMap;
  /** Folio y fecha del resultado emitido (se conservan al restaurar). */
  folio: string | null;
  createdAt: string | null;
};

/** id que recibe el h1 de la pantalla activa; nombra al diálogo. */
const SCREEN_TITLE_ID = "eval-screen-title";

/**
 * Avance guardado en sessionStorage: sobrevive a una recarga o a que el
 * sistema descarte la pestaña (p. ej. al volver de WhatsApp), y muere al
 * cerrarla. Nunca sale del dispositivo. Se borra al salir con "Salir".
 */
const STORAGE_KEY = "evaluacion:progreso:v1";

/** Confirmación al salir con avance: las respuestas se pierden. */
const EXIT_CONFIRM: Record<Locale, string> = {
  es: "¿Salir de la evaluación? Se perderán tus respuestas.",
  en: "Leave the assessment? Your answers will be lost.",
};

/** Confirmación al dejar la página con Atrás desde la primera pantalla. */
const LEAVE_CONFIRM: Record<Locale, string> = {
  es: "¿Salir de la evaluación?",
  en: "Leave the assessment?",
};

const PICKER_STATE: FlowState = {
  zone: null,
  trail: [],
  fromPicker: true,
  alarmFlags: [],
  triageFlags: [],
  answers: {},
  folio: null,
  createdAt: null,
};

/** Estado inicial del flujo con entrada directa (?zona=) o sin ella. */
function initialState(zone: BodyZoneId | null): FlowState {
  if (!zone) return PICKER_STATE;
  return { ...PICKER_STATE, zone, trail: [{ step: "alarma" }], fromPicker: false };
}

/** Profundidad del historial que este flujo apiló (0 = la entrada base). */
function historyDepth(): number {
  const depth = (window.history.state as { evalDepth?: unknown } | null)
    ?.evalDepth;
  return typeof depth === "number" ? depth : 0;
}

function clearProgress() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Almacenamiento bloqueado (modo privado estricto): no hay nada que borrar.
  }
}

/**
 * Lee el avance guardado si corresponde a esta página: mismo idioma y, con
 * entrada directa, la misma zona. Descarta lo que no cuadre con el test
 * (p. ej. un índice fuera de rango tras cambiar el contenido).
 */
function readProgress(
  locale: Locale,
  initialZone: BodyZoneId | undefined
): FlowState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as FlowState & { locale?: Locale };
    if (saved.locale !== locale || !saved.zone) return null;
    if (!AVAILABLE_ZONES.includes(saved.zone)) return null;
    if (initialZone && saved.zone !== initialZone) return null;
    const test = getTest(saved.zone, locale);
    if (!test || !Array.isArray(saved.trail) || saved.trail.length === 0) {
      return null;
    }
    const valid = saved.trail.every((p) => {
      if (p.step === "triaje") return p.index >= 0 && p.index < test.triage.length;
      if (p.step === "test") {
        return p.qIndex >= 0 && p.qIndex < test.questions.length;
      }
      if (p.step === "resultado") return Boolean(saved.folio && saved.createdAt);
      return p.step === "alarma";
    });
    if (!valid) return null;
    return {
      zone: saved.zone,
      trail: saved.trail,
      fromPicker: Boolean(saved.fromPicker),
      alarmFlags: saved.alarmFlags ?? [],
      triageFlags: saved.triageFlags ?? [],
      answers: saved.answers ?? {},
      folio: saved.folio ?? null,
      createdAt: saved.createdAt ?? null,
    };
  } catch {
    return null;
  }
}

/** Clave estable de la pantalla activa: re-monta la pantalla y mueve el foco. */
function positionKey(p: Position | undefined): string {
  if (!p) return "zona";
  if (p.step === "triaje") return `triaje-${p.index}`;
  if (p.step === "test") return `test-${p.qIndex}`;
  return p.step;
}

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

// Montado en el cliente (false en el servidor y durante la hidratación): el
// portal necesita document.body, que el HTML del servidor no tiene.
const noopSubscribe = () => () => {};

export default function EvaluationFlow({
  initialZone,
  locale = "es",
}: {
  initialZone?: BodyZoneId;
  locale?: Locale;
}) {
  const ui = getEvaluationUi(locale);
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const [state, setState] = useState<FlowState>(() =>
    initialState(initialZone && getTest(initialZone, locale) ? initialZone : null)
  );
  // Sentido de la navegación: la pantalla nueva llega desde el lado hacia el
  // que se avanza (1, derecha) o se retrocede (-1, izquierda). 0 = sin
  // animación: la primera pantalla de una entrada directa o restaurada ya
  // cubre la pantalla desde el primer cuadro.
  const [direction, setDirection] = useState<-1 | 0 | 1>(
    initialZone ? 0 : 1
  );
  const screenRef = useRef<HTMLDivElement>(null);

  // Copias vivas para los oyentes del historial (registrados una sola vez).
  const stateRef = useRef(state);
  // Profundidad del historial que corresponde a la pantalla visible. Invariante
  // tras sincronizar: depthRef === trail.length.
  const depthRef = useRef(0);
  // El próximo popstate lo provocó el propio flujo (al salir): se ignora.
  const skipPopRef = useRef(false);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const test = useMemo(
    () => (state.zone ? getTest(state.zone, locale) : null),
    [state.zone, locale]
  );
  const top = state.trail[state.trail.length - 1];
  const overlay = state.trail.length > 0 && test !== null;

  // Resultado derivado del estado: el mismo folio en cada render y al
  // restaurar (computeResult es determinista con el folio ya emitido).
  const result = useMemo(() => {
    if (!test || top?.step !== "resultado" || !state.folio || !state.createdAt) {
      return null;
    }
    return computeResult(
      test,
      state.answers,
      [...state.alarmFlags, ...state.triageFlags],
      locale,
      { folio: state.folio, createdAt: new Date(state.createdAt) }
    );
  }, [
    test,
    top?.step,
    state.answers,
    state.alarmFlags,
    state.triageFlags,
    state.folio,
    state.createdAt,
    locale,
  ]);

  /**
   * Alinea el historial con la pila: apila las entradas que falten (una por
   * pantalla) o corrige la actual si sobra. Solo se llama dentro de un gesto
   * del usuario: Chrome salta al ir Atrás las entradas creadas sin gesto.
   */
  const syncHistory = useCallback((length: number) => {
    if (depthRef.current > length) {
      window.history.replaceState({ evalDepth: length }, "");
      depthRef.current = length;
    }
    while (depthRef.current < length) {
      depthRef.current += 1;
      window.history.pushState({ evalDepth: depthRef.current }, "");
    }
  }, []);

  /** Avanza a una pantalla nueva (apila estado e historial). */
  const advance = useCallback(
    (next: FlowState) => {
      setDirection(1);
      setState(next);
      stateRef.current = next;
      syncHistory(next.trail.length);
    },
    [syncHistory]
  );

  // Al montar: restaura el avance guardado (recarga, pestaña descartada) o
  // registra el inicio de la entrada directa. La profundidad del historial se
  // lee de la entrada actual: tras recargar, las entradas del flujo siguen ahí.
  useEffect(() => {
    depthRef.current = historyDepth();
    const saved = readProgress(locale, initialZone);
    if (saved) {
      // Leer sessionStorage solo es posible tras montar (el servidor no lo
      // tiene): este setState es la sincronización con ese sistema externo.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDirection(0);
      setState(saved);
      stateRef.current = saved;
      return;
    }
    const startZone = stateRef.current.zone;
    if (startZone) trackEvent("evaluacion_iniciada", { zona: startZone });
    // Solo al montar: initialZone y locale vienen fijos de la URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guarda el avance en cada cambio; con el selector a la vista no hay nada
  // que guardar. (Corre después del efecto de restauración, que ya leyó.)
  useEffect(() => {
    if (state.trail.length === 0) {
      clearProgress();
      return;
    }
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, locale })
      );
    } catch {
      // Sin almacenamiento el flujo sigue igual, solo sin restauración.
    }
  }, [state, locale]);

  // Primer gesto dentro del flujo: con entrada directa o restaurada aún faltan
  // las entradas de historial de las pantallas visibles (no se crean al montar
  // porque Chrome las saltaría). Con ellas, Atrás pasa por el flujo.
  useEffect(() => {
    if (!overlay) return;
    const onGesture = () => syncHistory(stateRef.current.trail.length);
    window.addEventListener("pointerdown", onGesture, true);
    window.addEventListener("keydown", onGesture, true);
    return () => {
      window.removeEventListener("pointerdown", onGesture, true);
      window.removeEventListener("keydown", onGesture, true);
    };
  }, [overlay, syncHistory]);

  // Atrás del sistema (o el botón Atrás del flujo, que llama history.back()):
  // retrocede un paso. Si con eso se saldría del flujo, confirma antes.
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const target =
        typeof (e.state as { evalDepth?: unknown } | null)?.evalDepth === "number"
          ? (e.state as { evalDepth: number }).evalDepth
          : 0;
      if (skipPopRef.current) {
        skipPopRef.current = false;
        depthRef.current = target;
        return;
      }
      const s = stateRef.current;
      if (s.trail.length === 0) {
        depthRef.current = target;
        return;
      }
      // Adelante: no hay pantalla que rehacer (se desapiló); se deshace.
      if (target > depthRef.current) {
        skipPopRef.current = true;
        window.history.go(depthRef.current - target);
        return;
      }
      if (target === depthRef.current) return;

      if (target >= 1) {
        const next = { ...s, trail: s.trail.slice(0, target) };
        depthRef.current = target;
        setDirection(-1);
        setState(next);
        stateRef.current = next;
        return;
      }

      // target 0: el gesto deja el flujo. De la alarma al selector (misma
      // página, sin respuestas) no hay nada que perder; en otro caso se pide
      // confirmación y, si se cancela, se reponen las entradas consumidas.
      const quiet = s.fromPicker && s.trail.length === 1;
      if (!quiet) {
        const message =
          s.trail.length > 1 ? EXIT_CONFIRM[locale] : LEAVE_CONFIRM[locale];
        if (!window.confirm(message)) {
          depthRef.current = 0;
          syncHistory(s.trail.length);
          return;
        }
      }
      depthRef.current = 0;
      clearProgress();
      setDirection(-1);
      setState(PICKER_STATE);
      stateRef.current = PICKER_STATE;
      // Entrada directa: el usuario pidió volver a la página anterior. Si no
      // la hay (enlace abierto en pestaña nueva), se queda en el selector.
      if (!s.fromPicker) window.history.back();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [locale, syncHistory]);

  // Cada pantalla nueva recibe el foco en su h1: el lector de pantalla la
  // anuncia y el teclado no queda perdido en el <body> tras el re-montaje
  // (también al pasar del árbol de la página al portal tras hidratar).
  // Con la longitud de la pila: un "goto" a la misma pregunta también re-monta.
  const screenKey = `${state.trail.length}:${positionKey(top)}`;
  useEffect(() => {
    if (!overlay) return;
    const h1 = screenRef.current?.querySelector("h1");
    if (!h1) return;
    h1.id = SCREEN_TITLE_ID;
    h1.tabIndex = -1;
    h1.focus({ preventScroll: true });
  }, [overlay, screenKey, mounted]);

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

  function handleZoneSelect(zoneId: BodyZoneId) {
    if (!getTest(zoneId, locale)) return;
    trackEvent("evaluacion_iniciada", { zona: zoneId });
    advance({
      ...PICKER_STATE,
      zone: zoneId,
      trail: [{ step: "alarma" }],
      fromPicker: true,
    });
  }

  function handleAlarmContinue(flagIds: string[]) {
    const s = stateRef.current;
    const nextPos: Position =
      test && test.triage.length > 0
        ? { step: "triaje", index: 0, flags: [] }
        : { step: "test", qIndex: 0 };
    advance({
      ...s,
      alarmFlags: flagIds,
      triageFlags: [],
      trail: [...s.trail, nextPos],
    });
  }

  function handleTriageAdvance(outcome: TriageOutcome) {
    const s = stateRef.current;
    if (s.trail[s.trail.length - 1]?.step !== "triaje") return;
    if (outcome.done) {
      advance({
        ...s,
        triageFlags: outcome.flags,
        trail: [...s.trail, { step: "test", qIndex: 0 }],
      });
    } else {
      advance({
        ...s,
        trail: [
          ...s.trail,
          { step: "triaje", index: outcome.index, flags: outcome.flags },
        ],
      });
    }
  }

  /** `value` es null cuando el paciente marcó "No aplica". */
  function handleAnswer(questionId: string, value: number | null) {
    const s = stateRef.current;
    const pos = s.trail[s.trail.length - 1];
    if (!test || pos?.step !== "test") return;
    // Una respuesta que llega tarde (otra pregunta ya en pantalla) se descarta.
    if (test.questions[pos.qIndex]?.id !== questionId) return;
    const answers = { ...s.answers, [questionId]: value };
    if (pos.qIndex + 1 >= test.questions.length) {
      advance({
        ...s,
        answers,
        folio: buildFolio(),
        createdAt: new Date().toISOString(),
        trail: [...s.trail, { step: "resultado" }],
      });
    } else {
      advance({
        ...s,
        answers,
        trail: [...s.trail, { step: "test", qIndex: pos.qIndex + 1 }],
      });
    }
  }

  /** Atrás del flujo = Atrás del navegador: una sola ruta para los dos. */
  function handleBack() {
    syncHistory(stateRef.current.trail.length);
    window.history.back();
  }

  /** Desde el triaje en adelante hay avance que se perdería: se confirma. */
  function handleExit() {
    if (top?.step !== "alarma" && !window.confirm(EXIT_CONFIRM[locale])) return;
    clearProgress();
    setDirection(-1);
    setState(PICKER_STATE);
    stateRef.current = PICKER_STATE;
    // Se desapilan las entradas del flujo para que Atrás no las recorra.
    if (depthRef.current > 0) {
      skipPopRef.current = true;
      window.history.go(-depthRef.current);
    }
  }

  const screenStyle = {
    "--eval-dx": `${direction * 10}px`,
  } as React.CSSProperties;
  const screenClass = direction === 0 ? "" : "eval-screen";

  const total = test?.questions.length ?? 0;
  const progress = (() => {
    switch (top?.step) {
      case undefined:
        return 0.04;
      case "alarma":
        return 0.12;
      case "triaje":
        return 0.2;
      case "test":
        return 0.3 + (total ? (top.qIndex / total) * 0.6 : 0);
      default:
        return 1;
    }
  })();

  // La selección de zona vive en la página (con header del sitio).
  if (!overlay || !test || !top) {
    return (
      <section className="px-4 py-12 md:py-16">
        <div key="zona" className={screenClass} style={screenStyle}>
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
  const dialog = (
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
        key={screenKey}
        className={`${screenClass} flex-1 px-4 py-8 sm:py-10 [&_h1:focus]:outline-none`}
        style={screenStyle}
      >
        {top.step === "alarma" && (
          <AlarmScreen
            test={test}
            onContinue={handleAlarmContinue}
            locale={locale}
          />
        )}

        {top.step === "triaje" && (
          <TriageScreen
            triage={test.triage}
            index={top.index}
            flags={top.flags}
            onAdvance={handleTriageAdvance}
            onBack={handleBack}
            locale={locale}
          />
        )}

        {top.step === "test" && (
          <QuestionScreen
            question={test.questions[top.qIndex]}
            index={top.qIndex}
            total={total}
            nounLabel={questionNounCap(test, ui)}
            timeLabel={timeLabel(test, ui)}
            naZoneFragment={test.naZoneFragment}
            onAnswer={handleAnswer}
            onBack={handleBack}
            locale={locale}
          />
        )}

        {top.step === "resultado" && result && (
          <ResultScreen result={result} locale={locale} />
        )}
      </div>
    </div>
  );

  // Portal al <body>: el diálogo fixed nunca queda dentro de un ancestro con
  // transform/filter (que lo convertiría en su bloque contenedor y lo dejaría
  // de 0 px de alto) ni bajo el contexto de apilamiento del header. Antes de
  // hidratar (entrada directa renderizada en el servidor) va en sitio.
  return mounted ? createPortal(dialog, document.body) : dialog;
}
