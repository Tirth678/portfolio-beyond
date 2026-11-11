'use client';

import { usePathname } from 'next/navigation';

/** An epilogue for the homepage, following the site footer. */
export function ImperialQuote() {
  const pathname = usePathname();
  if (pathname !== '/') return null;

  return (
    <section aria-label="Closing quote" className="relative isolate overflow-hidden border-t border-white/10 bg-[#0a0a0a] px-6 py-28 text-center sm:py-36 md:py-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/imperial-crown.webp')] bg-center bg-no-repeat opacity-65 [background-size:auto_100%]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/35 to-ink" />
      <div className="mx-auto max-w-4xl">
        <p aria-hidden="true" className="font-mono text-[10px] tracking-[0.35em] text-accent/65 uppercase">✦</p>
        <blockquote className="mt-8 font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.05] italic tracking-[-0.025em] text-paper">
          “My enemies are many,<br className="hidden sm:block" /> my equals are none.”
        </blockquote>
        <div aria-hidden="true" className="mx-auto mt-9 h-px w-12 bg-accent/60" />
        <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-paper/55 uppercase"><cite className="not-italic">Napoleon: Total War</cite> · 2010</p>
      </div>
    </section>
  );
}
