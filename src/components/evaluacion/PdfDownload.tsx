"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { EvaluationResult } from "@/lib/evaluacion/types";
import { getResultWhatsAppLink } from "@/lib/evaluacion/engine";

export default function PdfDownload({ result }: { result: EvaluationResult }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
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
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 font-body text-sm font-semibold text-primary transition duration-150 hover:bg-primary hover:text-white active:scale-[0.985]"
      >
        <Download className="h-4 w-4" strokeWidth={1.5} />
        Descargar mi reporte (PDF)
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/15 bg-primary-soft/50 p-4">
      <label
        htmlFor="pdf-name"
        className="font-body text-sm font-medium text-ink"
      >
        ¿A nombre de quién generamos tu PDF? (opcional)
      </label>
      <input
        id="pdf-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
        placeholder="Tu nombre"
        className="mt-2 w-full rounded-xl border border-ink/20 bg-background px-4 py-3 font-body text-ink outline-none focus:border-accent"
      />
      <button
        type="button"
        onClick={generate}
        disabled={busy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-white transition duration-150 hover:opacity-90 active:scale-[0.985] disabled:opacity-50"
      >
        <Download className="h-4 w-4" strokeWidth={1.5} />
        {busy ? "Generando…" : "Generar PDF"}
      </button>
      <p className="mt-2 font-body text-xs text-ink/45">
        El nombre solo se imprime en el documento; no se guarda en ningún lado.
      </p>
    </div>
  );
}
