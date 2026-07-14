import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileActionBar from "@/components/layout/MobileActionBar";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { GA_MEASUREMENT_ID } from "@/lib/config";
import { getUiStrings } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/types";

/**
 * Contenido del <body> compartido por los root layouts de cada locale.
 * Los tags <html>/<body> los pone cada layout (requisito de Next); aquí va
 * todo lo demás para no duplicar lógica entre idiomas.
 */
export default function BodyShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const strings = getUiStrings(locale);

  return (
    <>
      {/* Marca el documento como con-JS antes del paint para habilitar las
          animaciones de entrada sin provocar parpadeo (FOUC). */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js');",
        }}
      />
      <Header strings={strings} />
      <main className="flex-1">{children}</main>
      <Footer strings={strings} />
      <MobileActionBar strings={strings} />
      <WhatsAppFloat strings={strings} />
      {/* GA solo en producción y con ID: el dev server no ensucia métricas. */}
      {process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID && (
        <GoogleAnalytics />
      )}
    </>
  );
}
