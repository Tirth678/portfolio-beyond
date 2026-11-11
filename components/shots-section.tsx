import Link from 'next/link';
import { ParallaxSlider } from '@/components/block/parallax-slider';
import { shots } from '@/lib/shots';

export function ShotsSection() {
  return (
    <section id="shots" className="section border-t border-white/10">
      <div className="shell">
        <div data-reveal>
          <p className="section-label">04 — Shots</p>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[clamp(2.9rem,6vw,5.4rem)] leading-[0.92] tracking-[-0.025em]">
              Stills from<br /><em className="text-accent/90">the journal.</em>
            </h2>
            <p className="max-w-xs text-sm leading-7 text-paper/55 md:pb-2">
              Moments in photographs, marked by date and time. Drag or use the arrow keys to explore.
            </p>
          </div>
        </div>
      </div>
      {shots.length > 0 && (
        <div className="mt-8" data-reveal>
          <ParallaxSlider
            label="Shots gallery"
            orientation="landscape"
            scrollOnWheel={false}
            slides={shots.map((shot) => ({ title: `${shot.date} · ${shot.time}`, image: shot.src, alt: shot.alt, href: '/shots' }))}
          />
        </div>
      )}
      <div className="shell">
        <Link href="/shots" className="group mt-4 inline-flex items-center gap-3 border-b border-accent/40 pb-2 font-mono text-[10px] tracking-[0.18em] text-accent uppercase transition-colors hover:border-accent">
          Explore Shots <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
