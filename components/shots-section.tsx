import Image from 'next/image';
import Link from 'next/link';
import type { HeroSlide } from '@/lib/types';

export function ShotsSection({ shots }: { shots: HeroSlide[] }) {
  return (
    <section id="shots" className="section border-t border-white/10">
      <div className="shell">
        <div data-reveal>
          <p className="section-label">04 — Shots</p>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[clamp(2.9rem,6vw,5.4rem)] leading-[0.92] tracking-[-0.025em]">
              Stills from
              <br />
              <em className="text-accent/90">the journal.</em>
            </h2>
            <p className="max-w-xs text-sm leading-7 text-paper/55 md:pb-2">
              Five frames borrowed from the chapters above — light, weather and
              the city after dark. Prints on request.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {shots.map((shot, index) => (
            <figure
              key={shot.id}
              data-reveal
              className="group relative aspect-[3/4] overflow-hidden bg-white/5 last:col-span-2 last:aspect-[4/3] md:last:col-span-1 md:last:aspect-[3/4]"
            >
              <Image
                src={shot.image}
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-4">
                <span className="font-display text-xl leading-none text-paper">
                  {shot.title}
                </span>
                <span className="font-mono text-[9px] tracking-[0.18em] text-paper/50">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Link href="/shots" className="group mt-10 inline-flex items-center gap-3 border-b border-accent/40 pb-2 font-mono text-[10px] tracking-[0.18em] text-accent uppercase transition-colors hover:border-accent">
          Explore Shots <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
