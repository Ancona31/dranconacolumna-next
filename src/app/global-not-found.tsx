import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { SITE_VIEWPORT } from "@/lib/config";
import { fontVariables } from "@/lib/fonts";
import BodyShell from "@/components/layout/BodyShell";
import NotFoundView from "@/components/layout/NotFoundView";
import { getUiStrings } from "@/lib/i18n";

/**
 * 404 global para URLs que no coinciden con ninguna ruta. Con múltiples root
 * layouts (route groups (es)/(en)) Next no tiene un layout único desde el que
 * componer este caso, así que se define aquí y debe devolver el documento HTML
 * completo. Reusa el chrome ES (BodyShell) para que el 404 de rutas
 * inexistentes se vea igual que el resto del sitio en español.
 *
 * Los notFound() dentro del árbol ES siguen usando (es)/not-found.tsx.
 */
const strings = getUiStrings("es");

export const viewport: Viewport = SITE_VIEWPORT;

export const metadata: Metadata = {
  title: `${strings.notFound.metaTitle} | Dr. Ancona Cirugía de Columna`,
};

export default function GlobalNotFound() {
  return (
    <html
      lang="es-MX"
      className={`${fontVariables} h-full`}
      // Next 16 ya no anula el scroll-behavior: smooth de globals.css al
      // navegar. Con este atributo lo desactiva durante cada cambio de ruta y
      // la página nueva arranca arriba al instante (el scroll suave queda
      // solo para anclas dentro de la página).
      data-scroll-behavior="smooth"
      // Las extensiones del navegador suelen añadir atributos a <html> antes
      // de hidratar: no son errores de hidratación.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <BodyShell locale="es">
          <NotFoundView strings={strings} />
        </BodyShell>
      </body>
    </html>
  );
}
