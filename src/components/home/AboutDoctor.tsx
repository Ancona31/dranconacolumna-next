import ButtonLink from "@/components/ui/Button";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { DOCTOR_FULL_NAME } from "@/lib/config";

export default function AboutDoctor() {
  return (
    <section className="bg-primary-soft">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
        <PhotoPlaceholder
          label="FOTO REAL: retrato profesional del Dr. Ancona, bata, fondo neutro"
          className="aspect-[4/5] w-full"
        />

        <div>
          <h2 className="font-heading text-3xl font-bold text-primary">
            {DOCTOR_FULL_NAME}
          </h2>
          <p className="mt-4 font-body text-ink/80">
            Ortopedista y traumatólogo con alta especialidad en cirugía de
            columna. Me he preparado para ofrecerte las técnicas menos invasivas
            disponibles. Atiendo cada caso personalmente, desde la primera
            consulta hasta tu recuperación.
          </p>
          <div className="mt-6">
            <ButtonLink href="/sobre-mi" variant="outline">
              Conóceme
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
