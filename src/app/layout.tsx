import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileActionBar from "@/components/layout/MobileActionBar";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Cirugía de columna en Mérida. Evaluación orientativa y valoración con el Dr. Angel M. Ancona Pérez.";

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
      className={`${plusJakarta.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {/* Marca el documento como con-JS antes del paint para habilitar las
            animaciones de entrada sin provocar parpadeo (FOUC). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileActionBar />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
