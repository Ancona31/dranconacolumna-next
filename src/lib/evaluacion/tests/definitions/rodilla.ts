import type { TestStructure } from "../types";

// Escala 0-4 de dolor y de dificultad (los labels viven en el contenido).
const OPTIONS_0_4 = [0, 1, 2, 3, 4];

// Tabla oficial HSS ©2022 (raw 0-28 → interval de salud 0-100).
const RAW_TO_INTERVAL = [
  100.0, 91.975, 84.6, 79.914, 76.332, 73.342, 70.704, 68.284, 65.994, 63.776,
  61.583, 59.381, 57.14, 54.84, 52.465, 50.012, 47.487, 44.905, 42.281, 39.625,
  36.931, 34.174, 31.307, 28.251, 24.875, 20.941, 15.939, 8.291, 0.0,
];

export const rodillaStructure: TestStructure = {
  id: "rodilla-koos-jr",
  zoneId: "rodilla",
  estimatedMinutes: 1,
  resultDisplay: "bars",

  triage: [
    { id: "T1", options: [{ action: "goto:T2" }, { action: "goto:T3" }] },
    {
      id: "T2",
      options: [{ action: "flag:trauma" }, { action: "flag:urgente-trauma" }],
    },
    {
      id: "T3",
      options: [{ action: "flag:inestabilidad" }, { action: "continue" }],
    },
  ],

  questions: [
    { id: "q1", optionValues: OPTIONS_0_4 },
    { id: "q2", optionValues: OPTIONS_0_4 },
    { id: "q3", optionValues: OPTIONS_0_4 },
    { id: "q4", optionValues: OPTIONS_0_4 },
    { id: "q5", optionValues: OPTIONS_0_4 },
    { id: "q6", optionValues: OPTIONS_0_4 },
    { id: "q7", optionValues: OPTIONS_0_4 },
  ],

  domains: [
    { id: "basicas", itemIds: ["q1", "q6"] },
    { id: "moderadas", itemIds: ["q3", "q4", "q5"] },
    { id: "demandantes", itemIds: ["q2", "q7"] },
  ],

  scoring: { kind: "table", table: RAW_TO_INTERVAL },
};
