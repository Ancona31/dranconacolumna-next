import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { Review } from "@/lib/reviews-placeholder";

type GoogleReviewsProps = {
  reviews: Review[];
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-[#E9B44C]" : "text-ink/15"}`}
          strokeWidth={1.5}
          fill="currentColor"
        />
      ))}
    </div>
  );
}

export default function GoogleReviews({ reviews }: GoogleReviewsProps) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="font-heading text-3xl font-bold text-primary">
              Lo que dicen mis pacientes
            </h2>
            {/* TODO: reemplazar href por la URL del perfil de Google del doctor. */}
            <a
              href="#"
              className="font-body text-sm font-semibold text-accent hover:opacity-80"
            >
              ★ 4.9 · Ver todas las opiniones en Google
            </a>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={i} delay={i * 80} className="flex">
              <article className="flex flex-1 flex-col rounded-2xl border border-ink/10 bg-background p-6">
                <Stars rating={review.rating} />
                <p className="mt-4 flex-1 font-body text-ink/75">
                  {review.text}
                </p>
                <p className="mt-4 font-body text-sm font-bold text-ink">
                  {review.author}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
