import type { TestStructure } from "../types";

export const munecaStructure: TestStructure = {
  id: "muneca-prwhe",
  zoneId: "muneca",
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
      options: [{ action: "flag:mediano" }, { action: "continue" }],
    },
  ],

  questions: [
    { id: "r1", kind: "scale" },
    { id: "r2", kind: "scale" },
    { id: "r3", kind: "scale" },
    { id: "r4", kind: "scale" },
    { id: "r5", kind: "scale" },
    { id: "s1", kind: "scale" },
    { id: "s2", kind: "scale" },
    { id: "s3", kind: "scale" },
    { id: "s4", kind: "scale" },
    { id: "s5", kind: "scale" },
    { id: "s6", kind: "scale" },
    { id: "u1", kind: "scale" },
    { id: "u2", kind: "scale" },
    { id: "u3", kind: "scale" },
    { id: "u4", kind: "scale" },
  ],

  domains: [
    { id: "basicas", itemIds: ["s3", "s6", "u1"] },
    { id: "moderadas", itemIds: ["s1", "s2", "u2"] },
    { id: "demandantes", itemIds: ["s4", "s5", "r3", "u3", "u4"] },
  ],

  // PRWHE: dolor (r1-r5, /50) y función (s1-s6 + u1-u4, /100), cada uno 50%.
  // higher-is-worse → limitación = score directo (sin inversión).
  scoring: {
    kind: "weighted-subscales",
    direction: "higher-is-worse",
    subscales: [
      {
        id: "dolor",
        itemIds: ["r1", "r2", "r3", "r4", "r5"],
        maxRaw: 50,
        weight: 0.5,
      },
      {
        id: "funcion",
        itemIds: ["s1", "s2", "s3", "s4", "s5", "s6", "u1", "u2", "u3", "u4"],
        maxRaw: 100,
        weight: 0.5,
      },
    ],
  },
};
