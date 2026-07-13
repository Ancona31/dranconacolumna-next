import type { BodyZoneId } from "@/components/home/BodyFigureSVG";

/** Un paso de la escalera terapéutica, del conservador al quirúrgico. */
export type TratamientoPaso = {
  titulo: string;
  texto: string;
};

export type PadecimientoFaq = {
  pregunta: string;
  respuesta: string;
};

/**
 * Contenido completo de una página de padecimiento. Los archivos de datos viven
 * en esta carpeta y se registran en index.ts; la plantilla de
 * /padecimientos/[slug] los renderiza sin lógica propia por padecimiento.
 */
export type Padecimiento = {
  /** Debe coincidir con el slug en @/lib/conditions. */
  slug: string;
  nombre: string;
  grupo: "columna" | "ortopedia";
  metaTitle: string;
  metaDescription: string;
  /**
   * Etiqueta corta de la zona del cuerpo, para el chip del hero y el texto del
   * bloque post-síntomas. Se omite en los padecimientos paraguas (sin zona única).
   */
  zonaChip?: string;
  /**
   * Dato firmado y verificable para un segundo chip del hero. Opcional: solo se
   * pone donde hay un número real que respaldarlo — nunca se inventa.
   */
  statChip?: string;
  /** Párrafos de apertura, debajo del H1. */
  definicion: string[];
  sintomas: string[];
  cuandoPreocuparse: {
    intro?: string;
    señales: string[];
  };
  tratamiento: TratamientoPaso[];
  /**
   * Frase-firma del doctor, en primera persona, para el bloque "Cómo lo trato yo".
   * Va destacada entre comillas sobre los párrafos de comoLoTrato.
   */
  citaDoctor: string;
  /** Párrafos en primera persona, voz del doctor. */
  comoLoTrato: string[];
  faq: PadecimientoFaq[];
  /**
   * Zona del test al que apunta el CTA final. Se omite en los padecimientos
   * paraguas —familias de lesiones sin zona única—: entonces el CTA lleva al
   * mapa corporal completo para que el paciente señale dónde le duele.
   */
  testZone?: BodyZoneId;
  /**
   * Pregunta del CTA final, sin el sufijo " — gratis y sin registro." que
   * agrega la plantilla. Va completa en datos —y no interpolada con el nombre
   * de la zona— porque la concordancia de género varía por padecimiento.
   */
  testCtaQuestion: string;
  testCtaLabel: string;
};
