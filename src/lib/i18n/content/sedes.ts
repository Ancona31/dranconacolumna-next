import type { Locale } from "../types";
import type { Sede } from "@/lib/sedes";

/**
 * Textos visibles de las sedes por locale. Los datos de negocio (nombre,
 * teléfono, coordenadas, mapsUrl) siguen en @/lib/sedes; aquí solo vive lo que
 * cambia de idioma o de formato entre ES y EN (dirección mostrada, horarios y
 * etiquetas de las tarjetas). Lo consumen Locations (home) y la página de
 * contacto.
 */

export interface SedeCopy {
  /** Líneas de dirección; se renderizan unidas por <br/>. */
  addressLines: string[];
  /** Horario en prosa ("Lunes a viernes, 9:00 a 11:00 h"). */
  horario: string;
  /** Etiqueta corta del chip ("Mañanas · Lun a Vie"). */
  horarioCorto: string;
}

export interface SedesCopy {
  /** Prefijo del renglón de horario ("Consulta con cita previa"). */
  bookingLabel: string;
  callButton: string;
  whatsappButton: string;
  /** Enlace de mapa en la tarjeta del home ("Cómo llegar →"). */
  directionsLink: string;
  /** Enlace de mapa en la página de contacto ("Ver en Google Maps →"). */
  mapsLink: string;
  /** Pie del botón de llamar en contacto ("Para información de la sede"). */
  forOfficeInfo: string;
  byId: Record<Sede["id"], SedeCopy>;
}

const SEDES_ES: SedesCopy = {
  bookingLabel: "Consulta con cita previa",
  callButton: "Llamar a la clínica",
  whatsappButton: "Agendar por WhatsApp",
  directionsLink: "Cómo llegar →",
  mapsLink: "Ver en Google Maps →",
  forOfficeInfo: "Para información de la sede",
  byId: {
    merida: {
      addressLines: ["Esquina C. 34 × C. 13, Los Reyes", "Mérida, Yucatán · C.P. 97156"],
      horario: "Lunes a viernes, 9:00 a 11:00 h",
      horarioCorto: "Mañanas · Lun a Vie",
    },
    uman: {
      addressLines: ["C. 20 × 23 y 25, Centro", "Umán, Yucatán · C.P. 97390"],
      horario: "Lunes a viernes, 17:00 a 20:00 h",
      horarioCorto: "Tardes · Lun a Vie",
    },
  },
};

const SEDES_EN: SedesCopy = {
  bookingLabel: "By appointment only",
  callButton: "Call the clinic",
  whatsappButton: "Book via WhatsApp",
  directionsLink: "Get directions →",
  mapsLink: "View on Google Maps →",
  forOfficeInfo: "For office information",
  byId: {
    merida: {
      addressLines: ["Corner of Calle 34 and Calle 13, Los Reyes, Mérida, Yucatán 97156"],
      horario: "Monday–Friday, 9:00–11:00 AM",
      horarioCorto: "Mornings · Mon–Fri",
    },
    uman: {
      addressLines: ["Calle 20 between Calles 23 and 25, Centro, Umán, Yucatán 97390"],
      horario: "Monday–Friday, 5:00–8:00 PM",
      horarioCorto: "Afternoons · Mon–Fri",
    },
  },
};

const SEDES_COPY: Record<Locale, SedesCopy> = { es: SEDES_ES, en: SEDES_EN };

export function getSedesCopy(locale: Locale): SedesCopy {
  return SEDES_COPY[locale];
}
