import type { TestStructure } from "../types";

export const codoStructure: TestStructure = {
  id: "codo-pree",
  zoneId: "codo",
  estimatedMinutes: 2,
  domainThresholds: [2.5, 5, 7.5],

  triage: [
    {
      id: "T1",
      options: [{ action: "goto:T2" }, { action: "goto:T3" }],
    },
    {
      id: "T2",
      options: [{ action: "flag:urgente-trauma" }, { action: "flag:trauma" }],
    },
    {
      id: "T3",
      options: [{ action: "flag:cubital" }, { action: "continue" }],
    },
  ],

  questions: [
    { id: "p1", kind: "scale" },
    { id: "p2", kind: "scale" },
    { id: "p3", kind: "scale" },
    { id: "p4", kind: "scale" },
    { id: "p5", kind: "scale" },
    { id: "e1", kind: "scale" },
    { id: "e2", kind: "scale" },
    { id: "e3", kind: "scale" },
    { id: "e4", kind: "scale" },
    { id: "e5", kind: "scale" },
    { id: "e6", kind: "scale" },
    { id: "e7", kind: "scale" },
    { id: "e8", kind: "scale" },
    { id: "e9", kind: "scale" },
    { id: "e10", kind: "scale" },
    { id: "e11", kind: "scale" },
    { id: "u1", kind: "scale" },
    { id: "u2", kind: "scale" },
    { id: "u3", kind: "scale" },
    { id: "u4", kind: "scale" },
  ],

  domains: [
    {
      id: "basicas",
      itemIds: ["e2", "e7", "e8", "u1"],
    },
    {
      id: "moderadas",
      itemIds: ["e1", "e9", "e10", "e11", "e4", "u2"],
    },
    {
      id: "demandantes",
      itemIds: ["e3", "e5", "e6", "p3", "u3", "u4"],
    },
  ],

  // PREE: dolor (p1-p5, /50) y función (e1-e11 + u1-u4, /150), cada uno 50%.
  // higher-is-worse → limitación = score directo (sin inversión).
  scoring: {
    kind: "weighted-subscales",
    direction: "higher-is-worse",
    subscales: [
      {
        id: "dolor",
        itemIds: ["p1", "p2", "p3", "p4", "p5"],
        maxRaw: 50,
        weight: 0.5,
      },
      {
        id: "funcion",
        itemIds: [
          "e1",
          "e2",
          "e3",
          "e4",
          "e5",
          "e6",
          "e7",
          "e8",
          "e9",
          "e10",
          "e11",
          "u1",
          "u2",
          "u3",
          "u4",
        ],
        maxRaw: 150,
        weight: 0.5,
      },
    ],
  },
};
