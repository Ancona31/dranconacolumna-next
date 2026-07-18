import { WHATSAPP_PHONE } from "@/lib/config";

/**
 * Construye un enlace wa.me con el mensaje ya codificado para URL. Por defecto
 * usa el WhatsApp personal del doctor (config); las tarjetas de sede pasan el
 * número de su clínica (`sede.whatsapp`) para dirigir el CTA a esa sede.
 */
export function buildWhatsAppLink(
  message: string,
  phone: string = WHATSAPP_PHONE
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
