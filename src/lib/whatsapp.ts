import { WHATSAPP_PHONE } from "@/lib/config";

/**
 * Construye un enlace wa.me con el teléfono de config y el mensaje
 * ya codificado para URL.
 */
export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}
