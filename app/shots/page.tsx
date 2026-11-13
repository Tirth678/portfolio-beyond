import { chapterMetadata } from '@/lib/seo';
import { LoadingImage } from '@/components/loading-image';
import Link from 'next/link';
import { shots } from '@/lib/shots';
import { AsciiComingSoon } from '@/components/ascii-coming-soon';

export const metadata = chapterMetadata('Shots', 'A collection of photographs by Tirth S Pandya, each marked with its date and time.', '/shots');

export default function ShotsPage() {
  return (
    <main className="pt-[76px]">
      <div className="shell pt-10">
        <div data-reveal className="flex items-center justify-between gap-6 font-mono text-[10px] tracking-[0.18em] text-paper/50 uppercase">
          <Link href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-paper">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            All chapters
          </Link>
          <span className="text-paper/30">04 / 05</span>
        </div>
        <div data-reveal className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="section-label">04 — Shots</p>
            <h1 className="mt-6 font-display text-[clamp(3rem,14vw,11rem)] leading-[0.82] tracking-[-0.04em]">Shots</h1>
          </div>
          <p className="max-w-sm text-sm leading-7 text-paper/55 md:col-span-4 md:pb-3">
            Moments in photographs, marked by date and time.
          </p>
        </div>
      </div>

      <div className="shell mt-14 border-t border-white/10 py-14 md:mt-20 md:py-20">
        {shots.length === 0 ? (
          <AsciiComingSoon />
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-20">
            {shots.map((shot, index) => (
              <figure key={`${shot.src}-${index}`} data-reveal className={index % 2 === 1 ? 'md:mt-16' : ''}>
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                  <LoadingImage src={shot.src} alt={shot.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
                </div>
                <figcaption className="mt-4 flex flex-wrap justify-between gap-3 font-mono text-[10px] tracking-[0.16em] text-paper/50 uppercase">
                  <span>{shot.date}</span><span>{shot.time}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
        {shots.length > 0 && (
          <p className="mt-16 border-t border-white/10 pt-8 text-center font-display text-3xl italic text-paper/60 md:mt-24">
            More shots on the way.
          </p>
        )}
      </div>
    </main>
  );
}
