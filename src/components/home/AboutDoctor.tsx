import ButtonLink from "@/components/ui/Button";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import Reveal from "@/components/ui/Reveal";
import { DOCTOR_FULL_NAME } from "@/lib/config";

export default function AboutDoctor() {
  return (
    <section className="bg-primary-soft">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
        <Reveal>
          <PhotoPlaceholder
            label="FOTO REAL: retrato profesional del Dr. Ancona, bata, fondo neutro"
            className="aspect-[4/5] w-full"
          />
        </Reveal>

        <Reveal delay={120}>
          <h2 className="font-heading text-3xl font-bold text-primary">
            {DOCTOR_FULL_NAME}
          </h2>
          <p className="mt-4 font-body text-ink/80">
            Ortopedista y traumatólogo con alta especialidad en cirugía de
            columna. Atiendo todo el aparato musculoesquelético — de una
            fractura a una cirugía compleja de columna — con las técnicas menos
            invasivas disponibles, personalmente y en cada etapa: desde la
            primera consulta hasta tu recuperación.
          </p>
          <div className="mt-6">
            <ButtonLink href="/sobre-mi" variant="outline">
              Conóceme
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
