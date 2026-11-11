import ContributionSkyline from '@/components/ui/contribution-skyline';
import type { GithubActivity } from '@/lib/github';

const goldPalette = ['#554718', '#8b7224', '#ba9830', '#e0c366'];

export function GithubSection({ activity }: { activity: GithubActivity }) {
  return (
    <section aria-labelledby="github-heading" className="section border-t border-white/10">
      <div className="shell">
        <div data-reveal className="grid gap-7 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8"><p className="section-label">Beyond the work</p><h2 id="github-heading" className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-none tracking-[-0.03em]">Built in the open<span className="text-accent">.</span></h2></div>
          <p className="max-w-sm text-sm leading-7 text-paper/50 md:col-span-4">A glimpse at the code, experiments and ideas taking shape on GitHub.</p>
        </div>
        <div className="mt-10" data-reveal>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] tracking-[0.16em] uppercase">
            <a href="https://github.com/Tirth678" target="_blank" rel="noopener noreferrer" className="text-paper/70 transition-colors hover:text-accent">@Tirth678 ↗<span className="sr-only"> (opens in a new tab)</span></a>
            <span className="text-paper/35">Public GitHub activity</span>
          </div>
          {activity.contributions.length ? (
            <div className="[--color-background:#111110] [--color-foreground:#f5f2ea] [--color-border:rgba(245,242,234,0.14)] [--color-muted-foreground:rgba(245,242,234,0.55)]">
              <ContributionSkyline data={activity.contributions} palette={goldPalette} title={activity.summary ?? undefined} />
            </div>
          ) : (
            <div className="border border-white/10 bg-white/[0.025] p-6 text-sm text-paper/55">Activity is temporarily unavailable. <a href="https://github.com/Tirth678" className="underline decoration-accent/50 underline-offset-4">View it on GitHub ↗</a></div>
          )}
        </div>
      </div>
    </section>
  );
}
