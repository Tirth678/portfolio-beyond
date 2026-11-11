import { chapterMetadata } from '@/lib/seo';
import Link from 'next/link';
import { SpaceRows } from '@/components/space-rows';
import { getSpacePage } from '@/lib/content';

export const metadata = chapterMetadata('Eternity', 'Explore Tirth S Pandya’s night-sky photography and observations of stars and planets.', '/space');

export default function SpacePage() {
  const { eyebrow, title, standfirst, intro, rows } = getSpacePage();

  return (
    <main className="pt-[76px]">
      <div className="shell pt-10">
        <div
          data-reveal
          className="flex items-center justify-between gap-6 font-mono text-[10px] tracking-[0.18em] text-paper/50 uppercase"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 transition-colors hover:text-paper"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              ←
            </span>
            All chapters
          </Link>
          <span className="text-paper/30">05 / 05</span>
        </div>

        <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8" data-reveal>
            <p className="section-label">{eyebrow}</p>
            <h1 className="mt-6 font-display text-[clamp(4rem,14vw,11rem)] leading-[0.82] tracking-[-0.04em]">
              {title}
            </h1>
          </div>
          <p
            className="max-w-sm text-sm leading-7 text-paper/55 md:col-span-4 md:pb-3"
            data-reveal
          >
            {standfirst}
          </p>
        </div>
      </div>

      <div className="shell mt-14 border-t border-white/10 pt-10 md:mt-20">
        <div className="grid gap-6 md:grid-cols-12">
          <p className="font-mono text-[10px] tracking-[0.22em] text-paper/35 uppercase md:col-span-3 md:pt-1.5">
            The chapter
          </p>
          <div
            className="space-y-5 md:col-span-7 md:col-start-5"
            data-reveal
          >
            {intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="max-w-[62ch] text-base leading-8 text-paper/65"
              >
                {paragraph}
              </p>
            ))}
            <p className="max-w-[62ch] pt-2 font-mono text-[10px] tracking-[0.18em] text-paper/35 uppercase">
              Select a frame to read the notes
            </p>
          </div>
        </div>
      </div>

      <SpaceRows rows={rows} />

      <div className="border-t border-white/10">
        <Link
          href="/#contact"
          className="shell group flex flex-col gap-6 py-14 md:flex-row md:items-end md:justify-between md:py-20"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-paper/35 uppercase">
              Next
            </p>
            <p className="mt-3 font-display text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-[-0.03em] transition-colors duration-500 group-hover:text-accent">
              Start a conversation
            </p>
          </div>
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-lg transition-all duration-500 group-hover:translate-x-1 group-hover:border-accent group-hover:text-accent"
          >
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
