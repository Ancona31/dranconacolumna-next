import type { Metadata } from "next";
import type { Locale } from "../types";

/**
 * Contenido de "contacto" / "contact" por locale. El español se extrae literal
 * de la página actual (render byte-idéntico); el inglés del brief de FASE 2.A.
 * Las tarjetas de sede toman sus textos de content/sedes.ts.
 */
export interface ContactContent {
  metadata: { title: Metadata["title"]; description: string };
  hero: { eyebrow: string; h1: string; text: string };
  cta: { button: string; sub: string };
  closing: string;
  /** Mensaje ES del CTA principal de WhatsApp; en EN se usa el default. */
  mainWhatsappMessage: string;
}

const CONTACT_ES: ContactContent = {
  metadata: {
    title: {
      absolute: "Contacto y consultorios en Mérida y Umán | Dr. Angel Ancona",
    },
    description:
      "Consulta con cita previa con el Dr. Angel Ancona, ortopedista y cirujano de columna. Sedes en Mérida (mañanas) y Umán (tardes). Escríbeme por WhatsApp para agendar tu espacio.",
  },
  hero: {
    eyebrow: "Contacto",
    h1: "Agenda tu consulta",
    text: "Atiendo con cita previa en dos sedes: Medclinik Mérida por las mañanas y Clínica Celus en Umán por las tardes. Los espacios de consulta son limitados y se agendan con anticipación — escríbeme por WhatsApp y te comparto la próxima disponibilidad.",
  },
  cta: {
    button: "Agendar por WhatsApp",
    sub: "Respondo personalmente para coordinar tu cita.",
  },
  closing:
    "Para urgencias, acude al servicio de urgencias más cercano. Este sitio no atiende emergencias.",
  mainWhatsappMessage: "Hola Dr. Ancona, quiero agendar una consulta.",
};

const CONTACT_EN: ContactContent = {
  metadata: {
    title: {
      absolute: "Contact & Offices in Mérida and Umán, Mexico | Dr. Angel Ancona",
    },
    description:
      "Book an appointment with Dr. Angel Ancona, orthopedic and spine surgeon. Offices in Mérida (mornings) and Umán (afternoons). Book your visit on WhatsApp.",
  },
  hero: {
    eyebrow: "Contact",
    h1: "Book your consultation",
    text: "I see patients by appointment at two locations: Medclinik in Mérida in the mornings and Clínica Celus in Umán in the afternoons. Appointments are limited and fill up well in advance — message me on WhatsApp and I'll send you the next available time.",
  },
  cta: {
    button: "Book via WhatsApp",
    sub: "I answer personally to set up your appointment.",
  },
  closing:
    "If this is a medical emergency, call 911 or go to your nearest emergency room. This site is not for emergencies.",
  mainWhatsappMessage: "Hola Dr. Ancona, quiero agendar una consulta.",
};

const CONTACT: Record<Locale, ContactContent> = {
  es: CONTACT_ES,
  en: CONTACT_EN,
};

export function getContactContent(locale: Locale): ContactContent {
  return CONTACT[locale];
}
