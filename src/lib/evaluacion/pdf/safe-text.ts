/**
 * Texto libre del usuario (el nombre) apto para el PDF. El reporte usa las
 * fuentes estándar Helvetica del visor, codificadas en WinAnsi (CP1252): un
 * carácter fuera de ese juego sale como basura ("Wiśniewska" → "Wi[niewska",
 * un emoji → "=u<ý"). Hasta registrar una TTF con Latin Extendido, se quitan
 * los emoji y las letras sin glifo caen a su base sin diacrítico (ś → s).
 *
 * Módulo ligero a propósito: lo importa PdfDownload sin arrastrar
 * @react-pdf/renderer al bundle inicial.
 */

/** Extras de CP1252 fuera de Latin-1 (0x80–0x9F con glifo). */
const CP1252_EXTRAS = new Set(
  "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ".split("")
);

/** Letras sin descomposición Unicode que tienen una base obvia. */
const FALLBACK: Record<string, string> = {
  ł: "l",
  Ł: "L",
  đ: "d",
  Đ: "D",
  ħ: "h",
  Ħ: "H",
  ı: "i",
};

function isWinAnsi(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (
    (code >= 0x20 && code <= 0x7e) ||
    (code >= 0xa0 && code <= 0xff) ||
    CP1252_EXTRAS.has(ch)
  );
}

export function toPdfSafeName(input: string): string {
  const out: string[] = [];
  const clean = input
    // Emoji, sus modificadores de tono, uniones (ZWJ) y selectores de variante.
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}‍︎️]/gu, "")
    .normalize("NFC");
  for (const ch of clean) {
    if (isWinAnsi(ch)) {
      out.push(ch);
      continue;
    }
    if (FALLBACK[ch]) {
      out.push(FALLBACK[ch]);
      continue;
    }
    // ś → s + ◌́ → s. Lo que no tenga base imprimible se descarta.
    const base = ch
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .split("")
      .filter(isWinAnsi)
      .join("");
    out.push(base);
  }
  return out.join("").replace(/\s+/g, " ").trim();
}
