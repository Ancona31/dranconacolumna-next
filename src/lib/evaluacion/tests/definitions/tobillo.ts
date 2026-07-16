import type { TestStructure } from "../types";

// Escala 0-4 de dificultad (los labels viven en el contenido).
const DIFFICULTY_OPTIONS = [0, 1, 2, 3, 4];

export const tobilloStructure: TestStructure = {
  id: "tobillo-faam-adl",
  zoneId: "tobillo",
  estimatedMinutes: 2,
  // Validez oficial: por debajo de 19 de 21 respondidas el score es orientativo.
  minAnswered: 19,

  triage: [
    { id: "T1", options: [{ action: "goto:T2" }, { action: "goto:T3" }] },
    {
      id: "T2",
      options: [{ action: "flag:trauma" }, { action: "flag:urgente-trauma" }],
    },
    {
      id: "T3",
      options: [{ action: "flag:inflamacion-aguda" }, { action: "continue" }],
    },
  ],

  questions: [
    { id: "q1", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q2", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q3", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q4", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q5", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q6", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q7", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q8", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q9", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q10", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q11", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q12", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q13", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q14", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q15", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q16", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q17", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q18", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q19", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q20", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
    { id: "q21", optionValues: DIFFICULTY_OPTIONS, allowNA: true },
  ],

  domains: [
    { id: "basicas", itemIds: ["q1", "q2", "q12", "q13", "q18"] },
    {
      id: "moderadas",
      itemIds: ["q3", "q6", "q7", "q9", "q14", "q15", "q16", "q17", "q19"],
    },
    { id: "demandantes", itemIds: ["q4", "q5", "q8", "q10", "q11", "q20", "q21"] },
  ],

  // FAAM-ADL: denominador adaptativo — los "No aplica" salen del cálculo.
  scoring: { kind: "linear-adaptive", perItemMax: 4 },
};
