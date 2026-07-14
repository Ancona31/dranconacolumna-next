"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/config";

/**
 * Carga gtag.js después de la hidratación (afterInteractive), sin bloquear el
 * render. El gate de producción/ID vive en el layout: aquí se asume que si se
 * monta, hay que cargar.
 */
export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
