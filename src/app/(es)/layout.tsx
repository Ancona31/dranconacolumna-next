import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { SITE_NAME, SITE_URL, SITE_VIEWPORT } from "@/lib/config";
import { fontVariables } from "@/lib/fonts";
import BodyShell from "@/components/layout/BodyShell";

const SITE_DESCRIPTION =
  "Cirugía de columna en Mérida. Evaluación orientativa y valoración con el Dr. Angel M. Ancona Pérez.";

export const viewport: Viewport = SITE_VIEWPORT;

export const metadata: Metadata = {
  // Necesario para que las URLs relativas (og:image) se resuelvan a absolutas.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Dr. Ancona Cirugía de Columna",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Dr. Angel Ancona · Ortopedia y Cirugía de Columna",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dr. Angel M. Ancona Pérez — Ortopedia, Traumatología y Cirugía de Columna Vertebral",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <BodyShell locale="es">{children}</BodyShell>
      </body>
    </html>
  );
}
