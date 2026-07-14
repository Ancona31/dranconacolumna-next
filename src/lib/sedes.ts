/**
 * Sedes donde el doctor atiende con cita previa. Fuente única de verdad para
 * la página de contacto y para el schema.org (MedicalClinic) de SEO local.
 * Cada campo alimenta tanto la UI como el JSON-LD, sin duplicar datos.
 */

export type Sede = {
  /** Identificador estable, usado en anclas y llaves. */
  id: "merida" | "uman";
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
  /** Teléfono en crudo, solo dígitos ("9994957916"). */
  telefono: string;
  /** Teléfono formateado para mostrar ("999 495 79 16"). */
  telefonoDisplay: string;
  lat: number;
  lng: number;
  /** Horario completo, en prosa ("Lunes a viernes, 9:00 a 11:00 h"). */
  horario: string;
  /** Etiqueta corta para el chip ("Mañanas · Lun a Vie"). */
  horarioCorto: string;
  /** Apertura en formato 24h, para openingHoursSpecification ("09:00"). */
  opens: string;
  /** Cierre en formato 24h, para openingHoursSpecification ("11:00"). */
  closes: string;
  mapsUrl: string;
  /** Origen de analítica del CTA de WhatsApp de esta sede. */
  origen: "sede_merida" | "sede_uman";
};

export const SEDES: Sede[] = [
  {
    id: "merida",
    nombre: "Medclinik Mérida",
    direccion: "Esquina C. 34 × C. 13, Los Reyes",
    ciudad: "Mérida, Yucatán",
    localidad: "Mérida",
    region: "Yucatán",
    cp: "97156",
    telefono: "9994957916",
    telefonoDisplay: "999 495 79 16",
    lat: 20.97978962216484,
    lng: -89.57207645354667,
    horario: "Lunes a viernes, 9:00 a 11:00 h",
    horarioCorto: "Mañanas · Lun a Vie",
    opens: "09:00",
    closes: "11:00",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.97978962216484,-89.57207645354667",
    origen: "sede_merida",
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
    lat: 20.87988952572975,
    lng: -89.7481702443132,
    horario: "Lunes a viernes, 17:00 a 20:00 h",
    horarioCorto: "Tardes · Lun a Vie",
    opens: "17:00",
    closes: "20:00",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.87988952572975,-89.7481702443132",
    origen: "sede_uman",
  },
];
