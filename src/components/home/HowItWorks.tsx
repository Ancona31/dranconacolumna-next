import { Crosshair, ClipboardList, FileText } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/types";
import { getHomeContent } from "@/lib/i18n/pages/home";

const ICONS = [Crosshair, ClipboardList, FileText];

export default function HowItWorks({ locale }: { locale: Locale }) {
  const c = getHomeContent(locale).howItWorks;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <h2 className="text-center font-heading text-3xl font-bold text-primary">
            {c.h2}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {c.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={step.title} delay={i * 80}>
                <div className="rounded-2xl border border-ink/10 bg-background p-6 text-center md:text-left">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary md:mx-0">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 font-body text-sm font-semibold text-accent">
                    {c.stepLabel} {i + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-sm text-ink/70">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
