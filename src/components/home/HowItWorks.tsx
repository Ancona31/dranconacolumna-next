import { Crosshair, ClipboardList, FileText } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    Icon: Crosshair,
    title: "Señala dónde te duele",
    text: "Toca la zona de tu cuerpo donde sientes molestia. Sin registro, sin dar tus datos.",
  },
  {
    Icon: ClipboardList,
    title: "Responde una evaluación clínica validada",
    text: "Preguntas sencillas — las mismas escalas que uso en consulta.",
  },
  {
    Icon: FileText,
    title: "Recibe tu reporte explicado",
    text: "En lenguaje claro, al momento, con el siguiente paso recomendado.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <h2 className="text-center font-heading text-3xl font-bold text-primary">
            Cómo funciona
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="rounded-2xl border border-ink/10 bg-background p-6 text-center md:text-left">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary md:mx-0">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <p className="mt-4 font-body text-sm font-semibold text-accent">
                  Paso {i + 1}
                </p>
                <h3 className="mt-1 font-heading text-lg font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-2 font-body text-sm text-ink/70">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
