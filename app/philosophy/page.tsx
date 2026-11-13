import { chapterMetadata } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import { philosophyImages } from '@/lib/philosophy';

export const metadata = chapterMetadata('Philosophy', 'Poems, ideas and reflections by Tirth S Pandya.', '/philosophy');

export default function PhilosophyPage() {
  return (
    <main className="pt-[76px]">
      <div className="shell pt-10">
        <div data-reveal className="flex items-center justify-between gap-6 font-mono text-[10px] tracking-[0.18em] text-paper/50 uppercase">
          <Link href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-paper">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            All chapters
          </Link>
          <span className="text-paper/30">02 / 05</span>
        </div>

        <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-9" data-reveal>
            <p className="section-label">02 — Beliefs</p>
            <h1 className="mt-6 font-display text-[clamp(2.75rem,11vw,10rem)] leading-[0.82] tracking-[-0.04em]">Philosophy</h1>
          </div>
          <p data-reveal className="max-w-sm text-sm leading-7 text-paper/55 md:col-span-3 md:pb-3">
            A space for ideas, beliefs and reflections.
          </p>
        </div>
      </div>

      <section aria-labelledby="reflections-heading" className="shell mt-14 border-t border-white/10 py-14 md:mt-20 md:py-20">
        <div data-reveal className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="reflections-heading" className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">The reflections</h2>
          <p className="font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">Select an image to view full size</p>
        </div>
        <div className="mt-8 grid grid-cols-1 items-start gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16">
          {philosophyImages.map((image, index) => (
            <figure key={image.src} data-reveal>
              <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`Open reflection ${String(index + 1).padStart(2, '0')} in full size (opens in a new tab)`} className="group block overflow-hidden bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 768px) 100vw, 50vw" className="h-auto w-full transition-opacity duration-300 group-hover:opacity-90" />
              </a>
              <figcaption className="mt-4 flex justify-between font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">
                <span>Reflection {String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">↗</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="border-t border-white/10">
        <Link href="/shots" className="shell group flex items-center justify-between gap-6 py-14 md:py-20">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-paper/35 uppercase">Explore another chapter</p>
            <p className="mt-3 font-display text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-[-0.03em] transition-colors duration-500 group-hover:text-accent">Shots</p>
          </div>
          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-lg transition-all duration-500 group-hover:translate-x-1 group-hover:border-accent group-hover:text-accent">→</span>
        </Link>
      </div>
    </main>
  );
}
