import type { TestStructure } from "../types";

// Escala 0-4 de dolor y de dificultad (los labels viven en el contenido).
const OPTIONS_0_4 = [0, 1, 2, 3, 4];

// Tabla de conversión OFICIAL HSS (raw 0-24 → interval de salud 0-100).
const RAW_TO_INTERVAL = [
  100.0, 92.34, 85.257, 80.55, 76.776, 73.472, 70.426, 67.516, 64.664, 61.815,
  58.93, 55.985, 52.965, 49.858, 46.652, 43.335, 39.902, 36.363, 32.735, 29.009,
  25.103, 20.805, 15.633, 8.104, 0.0,
];

export const caderaStructure: TestStructure = {
  id: "cadera-hoos-jr",
  zoneId: "cadera",
  estimatedMinutes: 1,

  triage: [
    { id: "T1", options: [{ action: "goto:T2" }, { action: "continue" }] },
    {
      id: "T2",
      options: [{ action: "flag:trauma" }, { action: "flag:urgente-trauma" }],
    },
  ],

  questions: [
    { id: "q1", optionValues: OPTIONS_0_4 },
    { id: "q2", optionValues: OPTIONS_0_4 },
    { id: "q3", optionValues: OPTIONS_0_4 },
    { id: "q4", optionValues: OPTIONS_0_4 },
    { id: "q5", optionValues: OPTIONS_0_4 },
    { id: "q6", optionValues: OPTIONS_0_4 },
  ],

  domains: [
    { id: "basicas", itemIds: ["q3", "q5", "q6"] },
    { id: "moderadas", itemIds: ["q1"] },
    { id: "demandantes", itemIds: ["q2", "q4"] },
  ],

  scoring: { kind: "table", table: RAW_TO_INTERVAL },
};
