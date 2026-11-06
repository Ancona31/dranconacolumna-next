"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";
import type { EvaluationResult } from "@/lib/evaluacion/types";
import { getResultWhatsAppLink } from "@/lib/evaluacion/engine";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";

/** Estados de la descarga que el i18n de la evaluación aún no cubre. */
const STATUS: Record<Locale, { done: string; error: string }> = {
  es: {
    done: "Descargado",
    error: "No se pudo generar el PDF. Inténtalo de nuevo.",
  },
  en: {
    done: "Downloaded",
    error: "We couldn't create the PDF. Please try again.",
  },
};

/** Tiempo que el botón muestra "Descargado" antes de volver a su estado. */
const DONE_MS = 2000;

export default function PdfDownload({
  result,
  locale = "es",
}: {
  result: EvaluationResult;
  locale?: Locale;
}) {
  const ui = getEvaluationUi(locale).pdfDownload;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const doneTimer = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const status = STATUS[locale];

  useEffect(
    () => () => {
      if (doneTimer.current) window.clearTimeout(doneTimer.current);
    },
    []
  );

  // Al desplegar el panel, el foco pasa directo al campo del nombre (después
  // del render: antes el panel sigue inert y no acepta foco).
  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  async function generate() {
    if (busy) return;
    setBusy(true);
    setDone(false);
    setError(false);
    try {
      const link = getResultWhatsAppLink(result);
      // Import dinámico: las librerías pesadas solo cargan al descargar.
      const QRCode = (await import("qrcode")).default;
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 180,
        margin: 0,
      });
      const [{ pdf }, { default: ReportPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/evaluacion/pdf/ReportPdf"),
      ]);
      const blob = await pdf(
        <ReportPdf
          result={result}
          name={name.trim() || undefined}
          qrDataUrl={qrDataUrl}
          locale={locale}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-evaluacion-${result.folio}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      trackEvent("reporte_pdf_descargado", {
        zona: result.test.zoneId,
        nivel: result.alertLevel === "urgente" ? "urgente" : result.level,
      });
      setDone(true);
      if (doneTimer.current) window.clearTimeout(doneTimer.current);
      doneTimer.current = window.setTimeout(() => setDone(false), DONE_MS);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  // Botón y panel conviven y se cruzan: el botón se pliega mientras el panel
  // se despliega (grid-rows 1fr ↔ 0fr), en vez de un cambio brusco de altura.
  return (
    <div>
      <div
        inert={open}
        className={`grid transition-[grid-template-rows,opacity] duration-250 ease-out ${
          open ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 font-body text-sm font-semibold text-primary transition-[transform,background-color,color] duration-150 ease-out hover:bg-primary hover:text-white active:scale-[0.97]"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            {ui.open}
          </button>
        </div>
      </div>

      <div
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-250 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="rounded-2xl border border-ink/15 bg-primary-soft/50 p-4">
            <label
              htmlFor="pdf-name"
              className="font-body text-sm font-medium text-ink"
            >
              {ui.nameQuestion}
            </label>
            <input
              ref={inputRef}
              id="pdf-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              placeholder={ui.namePlaceholder}
              className="mt-2 w-full rounded-xl border border-ink/20 bg-background px-4 py-3 font-body text-ink transition-colors duration-150 focus:border-accent"
            />
            <button
              type="button"
              onClick={generate}
              aria-busy={busy}
              disabled={busy}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-white transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97] disabled:cursor-progress disabled:opacity-70"
            >
              {busy ? (
                <Loader2
                  className="h-4 w-4 animate-spin motion-reduce:animate-none"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              ) : done ? (
                <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              )}
              {busy ? ui.generating : done ? status.done : ui.generate}
            </button>
            {/* Región viva: anuncia el éxito o el error sin mover el foco. */}
            <p aria-live="polite" className="font-body text-sm">
              {error && (
                <span className="mt-2 block text-danger">{status.error}</span>
              )}
            </p>
            <p className="mt-2 font-body text-xs text-muted">{ui.privacyNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
