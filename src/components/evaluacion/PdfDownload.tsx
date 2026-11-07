"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";
import type { EvaluationResult } from "@/lib/evaluacion/types";
import { getResultWhatsAppLink } from "@/lib/evaluacion/engine";
import { toPdfSafeName } from "@/lib/evaluacion/pdf/safe-text";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/types";
import { getEvaluationUi } from "@/lib/i18n/pages/evaluacion";
import { CALLOUT_BRAND } from "@/components/evaluacion/surfaces";
import { buttonClasses } from "@/components/ui/Button";

/** Estados de la descarga que el i18n de la evaluación aún no cubre. */
const STATUS: Record<
  Locale,
  { done: string; error: string; ready: string; openLink: string; retryLink: string }
> = {
  es: {
    done: "Descargado",
    error: "No se pudo generar el PDF. Inténtalo de nuevo.",
    ready: "Tu PDF está listo.",
    openLink: "Abrir mi PDF",
    retryLink: "¿No se descargó? Ábrelo aquí",
  },
  en: {
    done: "Downloaded",
    error: "We couldn't create the PDF. Please try again.",
    ready: "Your PDF is ready.",
    openLink: "Open my PDF",
    retryLink: "Didn't download? Open it here",
  },
};

/** Tiempo que el botón muestra "Descargado" antes de volver a su estado. */
const DONE_MS = 2000;

/**
 * Vida del enlace blob: la descarga es asíncrona y revocarlo en el mismo tick
 * puede abortarla (Safari, Firefox). Un minuto basta y no deja el PDF en
 * memoria indefinidamente.
 */
const BLOB_TTL_MS = 60_000;

/** Largo máximo del nombre impreso en el reporte. */
const NAME_MAX = 60;

/**
 * ¿El navegador descarga un blob con <a download>? Los navegadores dentro de
 * otras apps (Facebook, Instagram, WhatsApp, WebView de Android) ignoran el
 * atributo: ahí se ofrece abrir el PDF en vez de decir "Descargado".
 */
function canDownloadBlob(): boolean {
  if (!("download" in HTMLAnchorElement.prototype)) return false;
  return !/FBAN|FBAV|FB_IAB|Instagram|Line\/|WhatsApp|; wv\)/i.test(
    navigator.userAgent
  );
}

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
  // Enlace al PDF generado (blob:) mientras vive: respaldo visible cuando la
  // descarga no se pudo disparar o no se ve.
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const doneTimer = useRef<number | null>(null);
  const revokeTimer = useRef<number | null>(null);
  const urlRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const status = STATUS[locale];

  useEffect(
    () => () => {
      if (doneTimer.current) window.clearTimeout(doneTimer.current);
      if (revokeTimer.current) window.clearTimeout(revokeTimer.current);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    []
  );

  /** Revoca el blob anterior (si lo hay) y programa la del nuevo. */
  function keepUrl(url: string) {
    if (revokeTimer.current) window.clearTimeout(revokeTimer.current);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = url;
    setFileUrl(url);
    revokeTimer.current = window.setTimeout(() => {
      URL.revokeObjectURL(url);
      urlRef.current = null;
      setFileUrl(null);
    }, BLOB_TTL_MS);
  }

  // Al desplegar el panel, el foco pasa directo al campo del nombre (después
  // del render: antes el panel sigue inert y no acepta foco).
  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  async function generate(e?: React.FormEvent) {
    e?.preventDefault();
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
          name={toPdfSafeName(name) || undefined}
          qrDataUrl={qrDataUrl}
          locale={locale}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      keepUrl(url);
      trackEvent("reporte_pdf_descargado", {
        zona: result.test.zoneId,
        nivel: result.alertLevel === "urgente" ? "urgente" : result.level,
      });
      // "Descargado" solo si la descarga se disparó de verdad; si el
      // navegador no descarga blobs, queda el enlace para abrir el PDF.
      const canDownload = canDownloadBlob();
      setDownloaded(canDownload);
      if (canDownload) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte-evaluacion-${result.folio}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setDone(true);
        if (doneTimer.current) window.clearTimeout(doneTimer.current);
        doneTimer.current = window.setTimeout(() => setDone(false), DONE_MS);
      }
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
            className={buttonClasses({ variant: "outline", fullWidth: true })}
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
          {/* Formulario: Enter (o "Listo" del teclado del teléfono) genera. */}
          <form
            onSubmit={generate}
            className={`${CALLOUT_BRAND} p-4`}
          >
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
              maxLength={NAME_MAX}
              autoComplete="off"
              autoCapitalize="words"
              enterKeyHint="done"
              placeholder={ui.namePlaceholder}
              className="mt-2 w-full rounded-xl border border-ink/20 bg-background px-4 py-3 font-body text-ink transition-colors duration-150 focus:border-accent"
            />
            <button
              type="submit"
              aria-busy={busy}
              disabled={busy}
              className={buttonClasses({
                fullWidth: true,
                className: "mt-3 disabled:cursor-progress disabled:opacity-70",
              })}
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
              {!error && !busy && fileUrl && (
                <span className="mt-2 block text-ink/80">
                  {!downloaded && `${status.ready} `}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener"
                    className="font-semibold text-accent underline underline-offset-2"
                  >
                    {downloaded ? status.retryLink : status.openLink}
                  </a>
                </span>
              )}
            </p>
            <p className="mt-2 font-body text-xs text-muted">{ui.privacyNote}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
