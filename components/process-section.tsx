import Link from 'next/link';
import type { ProcessStep } from '@/lib/types';

export function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section id="thoughts" className="section border-t border-white/10">
      <div className="shell">
        <div data-reveal>
          <p className="section-label">03 — Thoughts</p>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[clamp(2.9rem,6vw,5.4rem)] leading-[0.92] tracking-[-0.025em]">
              How the work
              <br />
              <em className="text-accent/90">gets made.</em>
            </h2>
            <p className="max-w-xs text-sm leading-7 text-paper/55 md:pb-2">
              No hand-offs between thinking and making. Design and code move
              together from the first sketch to the last breakpoint.
            </p>
          </div>
        </div>

        <Link href="/thoughts" className="group mt-8 inline-flex items-center gap-3 border-b border-accent/40 pb-2 font-mono text-[10px] tracking-[0.18em] text-accent uppercase transition-colors hover:border-accent">
          Explore Thoughts <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>

        <ol className="mt-14 border-t border-white/10">
          {steps.map((step) => (
            <li
              key={step.number}
              data-reveal
              className="grid gap-4 border-b border-white/10 py-9 md:grid-cols-12 md:gap-6 md:py-11"
            >
              <span className="font-mono text-[10px] tracking-[0.18em] text-accent md:col-span-1">
                {step.number}
              </span>
              <h3 className="font-display text-3xl tracking-[-0.01em] md:col-span-4 md:text-4xl">
                {step.title}
              </h3>
              <p className="max-w-xl text-sm leading-7 text-paper/55 md:col-span-6 md:col-start-7">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
