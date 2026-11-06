import type { Sede } from "@/lib/sedes";

/**
 * Miniatura de Google Maps de una sede (embed por coordenadas). La comparten
 * la sección de sedes del home y la página de contacto. Carga diferida: el
 * iframe no se pide hasta acercarse al viewport.
 */
export default function SedeMap({
  sede,
  titlePrefix,
  className = "",
}: {
  sede: Sede;
  /** Prefijo traducido del title del iframe ("Mapa de" / "Map of"). */
  titlePrefix: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl ${className}`}>
      <iframe
        src={`https://maps.google.com/maps?q=${sede.lat},${sede.lng}&z=16&output=embed`}
        title={`${titlePrefix} ${sede.nombre}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-video w-full border-0"
      />
    </div>
  );
}
