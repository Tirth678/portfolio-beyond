'use client';

import * as React from 'react';
import { Tooltip } from '@base-ui/react/tooltip';
import type { Contribution } from '@/lib/github';

export type BrandLogo = { image: string; name: string };
export type LogoCloudProps = {
  brandLogos?: BrandLogo[];
  contributions?: Contribution[];
  username?: string;
  summary?: string | null;
  duration?: number;
  className?: string;
};

const levels = ['bg-white/[0.07]', 'bg-accent/25', 'bg-accent/45', 'bg-accent/70', 'bg-accent'];
const marqueeCss = `
@keyframes portfolio-logo-marquee { to { transform: translateX(calc(-100% - 0.5rem)); } }
.portfolio-logo-track { animation: portfolio-logo-marquee var(--marquee-duration) linear infinite; }
.portfolio-logo-track[data-reverse='true'] { animation-direction: reverse; }
.portfolio-logo-marquee:hover .portfolio-logo-track, .portfolio-logo-marquee:focus-within .portfolio-logo-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .portfolio-logo-track { animation: none; }
  .portfolio-logo-marquee { overflow-x: auto; }
}
`;

function MarqueeRow({ logos, duration, reverse }: { logos: BrandLogo[]; duration: number; reverse: boolean }) {
  if (!logos.length) return null;
  return (
    <div className="portfolio-logo-marquee flex gap-2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]" style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}>
      {Array.from({ length: 4 }, (_, copy) => (
        <div key={copy} aria-hidden={copy > 0 ? true : undefined} data-reverse={reverse} className="portfolio-logo-track flex shrink-0 gap-2">
          {logos.map((logo) => <div key={logo.name} title={copy === 0 ? logo.name : undefined} className="flex h-16 min-w-28 shrink-0 items-center justify-center gap-3 rounded-md border border-white/5 bg-white/[0.04] px-4">
            {/* Logo SVGs are generated locally from Simple Icons. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.image} alt="" className="size-6 opacity-75" />
            <span className="font-mono text-[10px] text-paper/60">{logo.name}</span>
          </div>)}
        </div>
      ))}
    </div>
  );
}

export default function LogoCloud({ brandLogos = [], contributions = [], username = 'Tirth678', summary, duration = 25, className = '' }: LogoCloudProps) {
  const half = Math.ceil(brandLogos.length / 2);
  const rows = [brandLogos.slice(0, half), brandLogos.slice(half)];
  const byDate = new Map(contributions.map(cell => [cell.date, cell]));
  const ordered = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  const start = ordered.length ? new Date(`${ordered[0].date}T00:00:00Z`) : null;
  if (start) start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const end = ordered.length ? new Date(`${ordered[ordered.length - 1].date}T00:00:00Z`) : null;
  const weeks = start && end ? Math.floor((end.getTime() - start.getTime()) / 604800000) + 1 : 0;

  return (
    <section aria-labelledby="github-heading" className={`section border-t border-white/10 ${className}`}>
      <style>{marqueeCss}</style>
      <div className="shell">
        <div data-reveal className="grid gap-7 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8"><p className="section-label">Beyond the work</p><h2 id="github-heading" className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-none tracking-[-0.03em]">Built in the open<span className="text-accent">.</span></h2></div>
          <p className="max-w-sm text-sm leading-7 text-paper/50 md:col-span-4">A glimpse at the code, experiments and ideas taking shape on GitHub.</p>
        </div>
        <div data-reveal className="mt-10 overflow-hidden border border-white/10 bg-white/[0.025] p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-[0.12em] text-paper transition-colors hover:text-accent">@{username} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><p className="mt-2 text-xs text-paper/45">{summary || 'Public GitHub contribution activity'}</p></div>
            <span className="font-mono text-[9px] tracking-[0.18em] text-accent uppercase">GitHub / activity</span>
          </div>
          {weeks > 0 ? (
            <Tooltip.Provider delay={100}>
              <div tabIndex={0} role="region" aria-label={`Contribution graph for ${username}. Scroll horizontally to view the full year.`} className="mt-8 overflow-x-auto pb-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                <div className="grid w-max grid-flow-col grid-rows-7 gap-1" aria-label="Daily contribution activity">
                  {Array.from({ length: weeks * 7 }, (_, index) => {
                    const date = new Date(start!.getTime() + index * 86400000).toISOString().slice(0, 10);
                    const cell = byDate.get(date);
                    if (!cell) return <span key={date} className="size-3.5 sm:size-4" aria-hidden="true" />;
                    return <Tooltip.Root key={date}><Tooltip.Trigger render={<span role="img" aria-label={`${cell.label} (${date})`} className={`size-3.5 rounded-[2px] sm:size-4 ${levels[cell.level]} transition-transform hover:scale-125`} />} /><Tooltip.Portal><Tooltip.Positioner sideOffset={5} className="z-[60]"><Tooltip.Popup className="rounded bg-paper px-3 py-2 font-mono text-[10px] text-ink shadow-lg">{cell.label} ({date})</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal></Tooltip.Root>;
                  })}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-end gap-1.5 font-mono text-[9px] text-paper/40"><span>Less</span>{levels.map(level => <span key={level} className={`size-2.5 rounded-[2px] ${level}`} aria-hidden="true" />)}<span>More</span></div>
            </Tooltip.Provider>
          ) : <p className="mt-8 border-t border-white/10 pt-6 text-sm text-paper/50">Activity is temporarily unavailable. <a href={`https://github.com/${username}`} className="underline decoration-accent/50 underline-offset-4">View it on GitHub ↗</a></p>}
          {brandLogos.length > 0 && <div className="mt-8 border-t border-white/10 pt-8"><p className="mb-5 font-mono text-[9px] tracking-[0.18em] text-paper/40 uppercase">Languages from recent public repositories</p><div className="space-y-2">{rows.map((row, i) => <MarqueeRow key={i} logos={row} reverse={i === 1} duration={duration} />)}</div></div>}
        </div>
      </div>
    </section>
  );
}
