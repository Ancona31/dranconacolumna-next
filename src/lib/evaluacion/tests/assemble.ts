/**
 * Ensamblador definición(lógica) + contenido(texto) → TestDefinition.
 *
 * Reconstruye EXACTAMENTE el objeto que el motor ya consume. Solo escribe un
 * campo cuando la fuente lo define (evita sembrar `undefined`), para que el
 * ensamblado sea idéntico al test estático original.
 */

import type {
  Domain,
  TestDefinition,
  TestQuestion,
  TriageQuestion,
} from "../types";
import type { TestContent, TestStructure } from "./types";

export function assembleTest(
  structure: TestStructure,
  content: TestContent
): TestDefinition {
  const questions: TestQuestion[] = structure.questions.map((qs) => {
    const qc = content.questions[qs.id];
    if (!qc) throw new Error(`Falta contenido para la pregunta ${qs.id}`);
    const q: TestQuestion = {
      id: qs.id,
      text: qc.text,
      shortLabel: qc.shortLabel,
    };
    if (qs.kind) q.kind = qs.kind;
    if (qc.contextHeader !== undefined) q.contextHeader = qc.contextHeader;
    if (qc.mirrorPhrase !== undefined) q.mirrorPhrase = qc.mirrorPhrase;
    if (qs.allowNA) q.allowNA = qs.allowNA;
    if (qs.kind === "scale") {
      if (qc.anchors) q.anchors = qc.anchors;
    } else {
      const values = qs.optionValues ?? [];
      const labels = qc.optionLabels ?? [];
      if (values.length !== labels.length) {
        throw new Error(
          `Desalineación de opciones en ${qs.id}: ${values.length} values vs ${labels.length} labels`
        );
      }
      q.options = values.map((value, i) => ({ label: labels[i], value }));
    }
    return q;
  });

  const triage: TriageQuestion[] = structure.triage.map((ts) => {
    const tc = content.triage[ts.id];
    if (!tc) throw new Error(`Falta contenido para el triaje ${ts.id}`);
    if (ts.options.length !== tc.optionLabels.length) {
      throw new Error(
        `Desalineación de opciones de triaje en ${ts.id}: ${ts.options.length} vs ${tc.optionLabels.length}`
      );
    }
    const t: TriageQuestion = {
      id: ts.id,
      text: tc.text,
      options: ts.options.map((opt, i) => ({
        label: tc.optionLabels[i],
        action: opt.action,
      })),
    };
    if (tc.urgentReason !== undefined) t.urgentReason = tc.urgentReason;
    return t;
  });

  const domains: Domain[] | undefined = structure.domains?.map((ds) => {
    const dc = content.domains?.[ds.id];
    if (!dc) throw new Error(`Falta contenido para el dominio ${ds.id}`);
    const d: Domain = {
      id: ds.id,
      label: dc.label,
      examples: dc.examples,
      itemIds: ds.itemIds,
    };
    if (ds.aggregation) d.aggregation = ds.aggregation;
    return d;
  });

  const def: TestDefinition = {
    id: structure.id,
    zoneId: structure.zoneId,
    zoneLabel: content.zoneLabel,
    instrumentName: content.instrumentName,
    instrumentCitation: content.instrumentCitation,
    estimatedMinutes: structure.estimatedMinutes,
    triage,
    questions,
    scoring: structure.scoring,
    reportTexts: content.reportTexts,
  };
  if (structure.resultDisplay) def.resultDisplay = structure.resultDisplay;
  if (content.questionNoun) def.questionNoun = content.questionNoun;
  if (structure.minAnswered !== undefined)
    def.minAnswered = structure.minAnswered;
  if (content.instructions !== undefined)
    def.instructions = content.instructions;
  if (structure.domainThresholds)
    def.domainThresholds = structure.domainThresholds;
  if (content.flagLabels) def.flagLabels = content.flagLabels;
  if (domains) def.domains = domains;
  if (content.semaphoreTitle !== undefined)
    def.semaphoreTitle = content.semaphoreTitle;
  if (structure.applyGradient !== undefined)
    def.applyGradient = structure.applyGradient;
  if (content.domainPhrases) def.domainPhrases = content.domainPhrases;
  return def;
}
