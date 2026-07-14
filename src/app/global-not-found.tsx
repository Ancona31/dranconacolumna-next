import type { Metadata } from "next";
import "@/app/globals.css";
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

export const metadata: Metadata = {
  title: `${strings.notFound.metaTitle} | Dr. Ancona Cirugía de Columna`,
};

export default function GlobalNotFound() {
  return (
    <html lang="es-MX" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        <BodyShell locale="es">
          <NotFoundView strings={strings} />
        </BodyShell>
      </body>
    </html>
  );
}
