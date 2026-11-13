import Link from 'next/link';
import { AsciiComingSoon } from '@/components/ascii-coming-soon';

type ChapterComingSoonProps = {
  title: string;
  eyebrow: string;
  number: string;
};

/** Temporary placeholder until the chapter's coming-soon component is supplied. */
export function ChapterComingSoon({ title, eyebrow, number }: ChapterComingSoonProps) {
  return (
    <main className="pt-[76px]">
      <div className="shell pt-10">
        <div data-reveal className="flex items-center justify-between gap-6 font-mono text-[10px] tracking-[0.18em] text-paper/50 uppercase">
          <Link href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-paper">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            All chapters
          </Link>
          <span className="text-paper/30">{number} / 05</span>
        </div>
        <div data-reveal className="mt-10 md:mt-16">
          <p className="section-label">{number} — {eyebrow}</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,14vw,11rem)] leading-[0.82] tracking-[-0.04em]">{title}</h1>
        </div>
        <div className="mt-14 border-t border-white/10 py-12 md:mt-20 md:py-16" data-reveal>
          <AsciiComingSoon />
        </div>
      </div>
    </main>
  );
}
