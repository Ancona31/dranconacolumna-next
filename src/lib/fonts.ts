import { Plus_Jakarta_Sans, Inter } from "next/font/google";

/**
 * Fuentes del sitio, compartidas por todos los root layouts (ES y EN).
 * Deben instanciarse una sola vez a nivel de módulo (requisito de next/font).
 */

export const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/** Variables CSS de fuente para aplicar en <html>. */
export const fontVariables = `${plusJakarta.variable} ${inter.variable}`;
