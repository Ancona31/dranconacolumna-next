import type { TestStructure } from "../types";

export const hombroStructure: TestStructure = {
  id: "hombro-spadi",
  zoneId: "hombro",
  estimatedMinutes: 2,
  domainThresholds: [2.5, 5, 7.5],

  triage: [
    {
      id: "T1",
      options: [{ action: "goto:T2" }, { action: "goto:T3" }],
    },
    {
      id: "T2",
      options: [
        // Ningún flag interrumpe el test: se registra y el flujo continúa.
        { action: "flag:urgente-trauma" },
        { action: "flag:trauma" },
      ],
    },
    {
      id: "T3",
      options: [{ action: "flag:manguito" }, { action: "goto:T4" }],
    },
    {
      id: "T4",
      options: [{ action: "flag:origen-cervical" }, { action: "continue" }],
    },
  ],

  questions: [
    { id: "d1", kind: "scale" },
    { id: "d2", kind: "scale" },
    { id: "d3", kind: "scale" },
    { id: "d4", kind: "scale" },
    { id: "d5", kind: "scale" },
    { id: "f1", kind: "scale" },
    { id: "f2", kind: "scale" },
    { id: "f3", kind: "scale" },
    { id: "f4", kind: "scale" },
    { id: "f5", kind: "scale" },
    { id: "f6", kind: "scale" },
    { id: "f7", kind: "scale" },
    { id: "f8", kind: "scale" },
  ],

  domains: [
    { id: "basicas", itemIds: ["f4", "f5", "f8"] },
    { id: "moderadas", itemIds: ["f1", "f2", "f3", "d4"] },
    { id: "demandantes", itemIds: ["d3", "f6", "f7", "d5"] },
  ],

  // SPADI numérico: dolor (d1-d5, /50) y función (f1-f8, /80), cada uno 50%.
  // higher-is-worse → limitación = score directo (sin inversión).
  scoring: {
    kind: "weighted-subscales",
    direction: "higher-is-worse",
    subscales: [
      { id: "dolor", itemIds: ["d1", "d2", "d3", "d4", "d5"], maxRaw: 50, weight: 0.5 },
      {
        id: "funcion",
        itemIds: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"],
        maxRaw: 80,
        weight: 0.5,
      },
    ],
  },
};
