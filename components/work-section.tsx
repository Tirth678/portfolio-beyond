import Image from 'next/image';
import Link from 'next/link';
import { getSpacePage } from '@/lib/content';
import { philosophyImages } from '@/lib/philosophy';
import { shots } from '@/lib/shots';
import type { HeroSlide } from '@/lib/types';

const chapters = [
  { label: 'Notes', href: '/notes' },
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Thoughts', href: '/thoughts' },
  { label: 'Shots', href: '/shots' },
  { label: 'Eternity', href: '/space' },
];

export function WorkSection({ slides }: { slides: HeroSlide[] }) {
  const firstShot = shots[0];
  const firstReflection = philosophyImages[0];
  const firstSpace = getSpacePage().rows[0];
  const thoughtsImage = slides.find((slide) => slide.id === 'thoughts');

  const entries = [
    ...(firstReflection ? [{
      href: '/philosophy', title: 'Reflections', category: 'Philosophy',
      detail: `${philosophyImages.length} reflections`,
      summary: 'Ideas, beliefs and reflections collected in images and words.',
      image: firstReflection.src, alt: firstReflection.alt, contain: true,
    }] : []),
    ...(firstShot ? [{
      href: '/shots', title: 'Moments in photographs', category: 'Shots',
      detail: `${shots.length} photographs`,
      summary: `A collection of photographs, each marked by date and time. Beginning with ${firstShot.date}, ${firstShot.time}.`,
      image: firstShot.src, alt: firstShot.alt, contain: false,
    }] : []),
    ...(firstSpace ? [{
      href: '/space', title: firstSpace.title, category: 'Eternity',
      detail: firstSpace.caption, summary: firstSpace.summary,
      image: firstSpace.image, alt: firstSpace.imageAlt, contain: false,
    }] : []),
    ...(thoughtsImage ? [{
      href: '/thoughts', title: 'Thoughts on Substack', category: 'Thoughts',
      detail: 'Essays & reflections',
      summary: 'Ideas and reflections, with previews here and full essays on Substack.',
      image: thoughtsImage.image, alt: thoughtsImage.alt, contain: false,
    }] : []),
  ];

  return (
    <section id="notes" className="section">
      <div className="shell">
        <div data-reveal>
          <p className="section-label">01 — Explore</p>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[clamp(2.9rem,6vw,5.4rem)] leading-[0.92] tracking-[-0.025em]">
              A little of<br /><em className="text-accent/90">everything.</em>
            </h2>
            <p className="max-w-xs text-sm leading-7 text-paper/55 md:pb-2">
              Reflections, photographs, writing and observations from across the chapters.
            </p>
          </div>
          <nav className="mt-10 flex flex-wrap gap-2" aria-label="Explore chapters">
            <a href="#notes" aria-current="page" className="rounded-full border border-accent bg-accent px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-ink uppercase">All</a>
            {chapters.map((chapter) => <Link key={chapter.href} href={chapter.href} className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-paper/55 uppercase transition-colors duration-300 hover:border-accent hover:text-accent">
              {chapter.label}{chapter.label === 'Notes' && <span className="text-paper/35">— coming soon</span>}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </Link>)}
          </nav>
        </div>

        <div data-reveal className="mt-14 grid gap-x-[5vw] gap-y-16 md:grid-cols-2">
          {entries.map((entry, index) => (
            <Link key={entry.href} href={entry.href} className={`group block ${index % 2 === 1 ? 'md:mt-24' : ''}`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                <Image src={entry.image} alt={entry.alt} fill sizes="(max-width: 768px) 100vw, 45vw" className={`${entry.contain ? 'object-contain' : 'object-cover'} transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] text-white/70">{String(index + 1).padStart(2, '0')}</span>
                <span className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.18em] text-white/85 uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">Explore chapter ↗</span>
              </div>
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3 border-t border-white/10 pt-4">
                <h3 className="font-display text-3xl tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent md:text-4xl">{entry.title}</h3>
                <span className="font-mono text-[10px] tracking-[0.14em] text-paper/40">{entry.detail}</span>
              </div>
              <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-accent/80 uppercase">{entry.category}</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-paper/55">{entry.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
