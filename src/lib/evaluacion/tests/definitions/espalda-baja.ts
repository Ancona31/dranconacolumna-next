import type { TestStructure } from "../types";

// Opciones Sí/No de todos los ítems del RMDQ (1 = describe al paciente).
const SI_NO_OPTION_VALUES = [1, 0];

export const espaldaBajaStructure: TestStructure = {
  id: "espalda-baja-rmdq",
  zoneId: "espalda-baja",
  estimatedMinutes: 2,
  resultDisplay: "checklist",

  triage: [
    {
      id: "T1",
      options: [{ action: "flag-next:radicular" }, { action: "next" }],
    },
    {
      id: "T2",
      options: [{ action: "flag-next:claudicacion" }, { action: "next" }],
    },
    {
      id: "T3",
      options: [
        // No interrumpe el test: se registra la urgencia y el test se completa.
        { action: "flag-next:urgente-neurologico" },
        { action: "next" },
      ],
    },
    {
      id: "T4",
      options: [{ action: "flag-next:trauma" }, { action: "next" }],
    },
  ],

  questions: [
    { id: "q1", optionValues: SI_NO_OPTION_VALUES },
    { id: "q2", optionValues: SI_NO_OPTION_VALUES },
    { id: "q3", optionValues: SI_NO_OPTION_VALUES },
    { id: "q4", optionValues: SI_NO_OPTION_VALUES },
    { id: "q5", optionValues: SI_NO_OPTION_VALUES },
    { id: "q6", optionValues: SI_NO_OPTION_VALUES },
    { id: "q7", optionValues: SI_NO_OPTION_VALUES },
    { id: "q8", optionValues: SI_NO_OPTION_VALUES },
    { id: "q9", optionValues: SI_NO_OPTION_VALUES },
    { id: "q10", optionValues: SI_NO_OPTION_VALUES },
    { id: "q11", optionValues: SI_NO_OPTION_VALUES },
    { id: "q12", optionValues: SI_NO_OPTION_VALUES },
    { id: "q13", optionValues: SI_NO_OPTION_VALUES },
    { id: "q14", optionValues: SI_NO_OPTION_VALUES },
    { id: "q15", optionValues: SI_NO_OPTION_VALUES },
    { id: "q16", optionValues: SI_NO_OPTION_VALUES },
    { id: "q17", optionValues: SI_NO_OPTION_VALUES },
    { id: "q18", optionValues: SI_NO_OPTION_VALUES },
    { id: "q19", optionValues: SI_NO_OPTION_VALUES },
    { id: "q20", optionValues: SI_NO_OPTION_VALUES },
    { id: "q21", optionValues: SI_NO_OPTION_VALUES },
    { id: "q22", optionValues: SI_NO_OPTION_VALUES },
    { id: "q23", optionValues: SI_NO_OPTION_VALUES },
    { id: "q24", optionValues: SI_NO_OPTION_VALUES },
  ],

  // Ítems 1,6,8,13,15,18,20,22,24 solo puntúan el score global (no son de dominio).
  domains: [
    { id: "basicas", itemIds: ["q7", "q9", "q12", "q14", "q16", "q19"] },
    { id: "moderadas", itemIds: ["q2", "q3", "q5", "q10", "q17", "q23"] },
    { id: "demandantes", itemIds: ["q4", "q11", "q21"] },
  ],

  // RMDQ: raw = número de frases marcadas Sí (0-24), lineal.
  scoring: { kind: "linear", maxRaw: 24 },
};
