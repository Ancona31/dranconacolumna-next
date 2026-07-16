import type { TestStructure } from "../types";

// Las cinco opciones del COMI reparten la escala 0-10 en pasos de 2.5.
const COMI_OPTION_VALUES = [0, 2.5, 5, 7.5, 10];

export const cuelloStructure: TestStructure = {
  id: "cuello-comi",
  zoneId: "cuello",
  estimatedMinutes: 1,
  domainThresholds: [2.5, 5, 7.5],
  // Las dimensiones no se ordenan por exigencia: un dolor alto no implica
  // actividades ni bienestar afectados.
  applyGradient: false,

  triage: [
    {
      id: "T1",
      options: [
        { action: "flag:radicular-cervical" },
        { action: "goto:T2" },
      ],
    },
    {
      // Sospecha de mielopatía de evolución lenta: valoración prioritaria en
      // 24-48 h, no urgencias. 'urgente' queda reservado al déficit AGUDO.
      id: "T2",
      options: [
        { action: "flag:mielopatia" },
        { action: "goto:T3" },
      ],
    },
    {
      id: "T3",
      options: [
        { action: "flag:trauma" },
        { action: "continue" },
      ],
    },
  ],

  questions: [
    { id: "i1", kind: "scale" },
    { id: "i2", kind: "scale" },
    { id: "i3", optionValues: COMI_OPTION_VALUES },
    { id: "i4", optionValues: COMI_OPTION_VALUES },
    { id: "i5", optionValues: COMI_OPTION_VALUES },
    { id: "i6", optionValues: COMI_OPTION_VALUES },
    { id: "i7", optionValues: COMI_OPTION_VALUES },
  ],

  domains: [
    {
      id: "dolor",
      itemIds: ["i1", "i2"],
      // Manda el peor de los dos sitios, no su promedio.
      aggregation: "max",
    },
    {
      id: "actividades",
      itemIds: ["i3", "i6", "i7"],
    },
    {
      id: "bienestar",
      itemIds: ["i4", "i5"],
    },
  ],

  // COMI: cinco dominios 0-10 con el mismo peso; dolor = peor sitio,
  // discapacidad = promedio. higher-is-worse (sin inversión).
  scoring: {
    kind: "comi",
    painItems: ["i1", "i2"],
    functionItem: "i3",
    wellbeingItem: "i4",
    qolItem: "i5",
    disabilityItems: ["i6", "i7"],
  },
};
