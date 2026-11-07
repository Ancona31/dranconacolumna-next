"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Sede } from "@/lib/sedes";
import type { Locale } from "@/lib/i18n/types";

/**
 * Miniatura de Google Maps de una sede (embed por coordenadas). La usa la
 * tarjeta de sede compartida (home y contacto). Carga diferida: el iframe no
 * se pide hasta acercarse al viewport.
 *
 * Mientras carga (o si un bloqueador lo impide) se ve un fondo de marca con
 * un pin y un pulso suave, no un hueco. El iframe no se oculta nunca: antes
 * de cargar es transparente y deja ver el fondo, así el mapa aparece aunque
 * el JS no llegue a hidratar. `hl` pone la interfaz de Google en el idioma
 * de la página.
 */
export default function SedeMap({
  sede,
  locale,
  titlePrefix,
  className = "",
}: {
  sede: Sede;
  locale: Locale;
  /** Prefijo traducido del title del iframe ("Mapa de" / "Map of"). */
  titlePrefix: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative isolate overflow-hidden rounded-xl bg-primary-soft ring-1 ring-inset ring-primary/10 ${className}`}
    >
      {/* Estado vacío detrás del iframe. El pulso se apaga al cargar y no
          corre con "reducir movimiento". */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 grid place-items-center ${
          loaded ? "" : "motion-safe:animate-pulse"
        }`}
      >
        <MapPin className="h-8 w-8 text-primary/30" strokeWidth={1.5} />
      </div>
      <iframe
        src={`https://maps.google.com/maps?q=${sede.lat},${sede.lng}&z=16&hl=${locale}&output=embed`}
        title={`${titlePrefix} ${sede.nombre}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        // Mismo alto en todas las tarjetas; el tope evita un mapa enorme en
        // la tarjeta que ocupa el ancho completo en tablet.
        className="block aspect-[16/10] max-h-72 w-full border-0"
      />
    </div>
  );
}
