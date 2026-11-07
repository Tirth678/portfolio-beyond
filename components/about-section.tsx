import Image from 'next/image';
import Link from 'next/link';
import type { About } from '@/lib/types';

export function AboutSection({ about }: { about: About }) {
  return (
    <section id="philosophy" className="section border-t border-white/10">
      <div className="shell">
        <p className="section-label" data-reveal>
          02 — Philosophy
        </p>

        <div className="mt-12 grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
              <Image
                src={about.image}
                alt={about.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <div className="mt-4 flex justify-between font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">
              <span>Mike Ross from Suits — fictional character</span>
              <span>Fig. 01</span>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7" data-reveal>
            <h2 className="max-w-xl font-display text-[clamp(2.4rem,4.6vw,4.2rem)] leading-[0.98] tracking-[-0.02em]">
              {about.heading}
            </h2>

            <div className="mt-8 space-y-5 text-[15px] leading-7 text-paper/60">
              {about.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <Link href="/philosophy" className="group mt-8 inline-flex items-center gap-3 border-b border-accent/40 pb-2 font-mono text-[10px] tracking-[0.18em] text-accent uppercase transition-colors hover:border-accent">
              Explore Philosophy <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {about.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl leading-none text-paper">
                      {stat.value}
                    </span>
                    <span className="mt-2 block font-mono text-[9px] tracking-[0.16em] text-paper/40 uppercase">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12">
              <p className="font-mono text-[10px] tracking-[0.2em] text-paper/40 uppercase">
                Capabilities
              </p>
              <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
                {about.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-paper/70"
                  >
                    <span>{capability}</span>
                    <span className="font-mono text-[10px] text-accent/70">+</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
