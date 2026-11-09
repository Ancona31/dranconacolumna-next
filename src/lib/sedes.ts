/**
 * Sedes donde el doctor atiende con cita previa. Fuente única de verdad para
 * la página de contacto y para el schema.org (MedicalClinic) de SEO local.
 * Cada campo alimenta tanto la UI como el JSON-LD, sin duplicar datos.
 * El orden del arreglo es el orden en pantalla: Prostasur, luego Celus.
 */

const LUNES_A_VIERNES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export type Sede = {
  /** Identificador estable, usado en anclas y llaves. */
  id: "prostasur" | "uman";
  nombre: string;
  /** Calle y colonia, sin ciudad. */
  direccion: string;
  /** Ciudad y estado juntos para mostrar ("Mérida, Yucatán"). */
  ciudad: string;
  /** Solo la localidad, para schema.org addressLocality ("Mérida"). */
  localidad: string;
  /** Estado, para schema.org addressRegion. */
  region: string;
  cp: string;
  /** Teléfono en crudo, solo dígitos ("9995143165"). */
  telefono: string;
  /** Teléfono formateado para mostrar ("999 514 31 65"). */
  telefonoDisplay: string;
  /**
   * WhatsApp de la sede en formato wa.me (52 + 10 dígitos, "529995143165").
   * Es el MISMO número que `telefono`; distinto del WhatsApp personal del
   * doctor (config). Alimenta el CTA "Agendar por WhatsApp" de cada tarjeta.
   */
  whatsapp: string;
  lat: number;
  lng: number;
  /** Días de consulta en inglés, para openingHoursSpecification de schema.org
   *  (["Tuesday", "Thursday"]). */
  dias: string[];
  /** Horario completo, en prosa ("Lunes a viernes, 9:00 a 11:00 h"). */
  horario: string;
  /** Etiqueta corta para el chip ("Mañanas · Lun a Vie"). */
  horarioCorto: string;
  /** Apertura en formato 24h, para openingHoursSpecification ("09:00"). */
  opens: string;
  /** Cierre en formato 24h, para openingHoursSpecification ("11:00"). */
  closes: string;
  mapsUrl: string;
  /** Sección de analítica de los CTA (WhatsApp y teléfono) de esta sede. */
  section: "sede_prostasur" | "sede_celus";
};

export const SEDES: Sede[] = [
  {
    id: "prostasur",
    nombre: "Prostasur",
    direccion: "C. 32 #198 × 17 y 21, García Ginerés",
    ciudad: "Mérida, Yucatán",
    localidad: "Mérida",
    region: "Yucatán",
    cp: "97070",
    telefono: "9995143165",
    telefonoDisplay: "999 514 31 65",
    whatsapp: "529995143165",
    lat: 20.9904344,
    lng: -89.6384806,
    dias: ["Tuesday", "Thursday"],
    horario: "Martes y jueves, 9:00 a 12:00 h",
    horarioCorto: "Mañanas · Mar y Jue",
    opens: "09:00",
    closes: "12:00",
    // Ficha de Google Maps del lugar (cid), no solo el pin de coordenadas.
    mapsUrl: "https://www.google.com/maps?cid=18369633801198173940",
    section: "sede_prostasur",
  },
  {
    id: "uman",
    nombre: "Clínica Celus",
    direccion: "C. 20 × 23 y 25, Centro",
    ciudad: "Umán, Yucatán",
    localidad: "Umán",
    region: "Yucatán",
    cp: "97390",
    telefono: "9992223173",
    telefonoDisplay: "999 222 31 73",
    whatsapp: "529992223173",
    lat: 20.87988952572975,
    lng: -89.7481702443132,
    dias: LUNES_A_VIERNES,
    horario: "Lunes a viernes, 17:00 a 20:00 h",
    horarioCorto: "Tardes · Lun a Vie",
    opens: "17:00",
    closes: "20:00",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.87988952572975,-89.7481702443132",
    section: "sede_celus",
  },
];
