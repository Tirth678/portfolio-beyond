'use client';

import { fillStatusDays, StatusBars, toIsoDate, useStatusToday } from '@/components/block/status-bars';

export function FlintStatus() {
  const today = useStatusToday();
  // Illustrative values only: this is not connected to an uptime monitor.
  const days = today ? fillStatusDays(toIsoDate(Date.parse(`${today}T00:00:00Z`) - 89 * 86_400_000), today) : [];
  return (
    <section aria-labelledby="flint-status-heading" className="border-t border-white/10 py-16 md:py-20">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-center" data-reveal>
          <div className="md:col-span-4">
            <p className="section-label">System status</p>
            <h2 id="flint-status-heading" className="mt-5 font-display text-4xl tracking-[-0.02em]">FlinT AI Labs</h2>
            <p className="mt-3 text-sm leading-6 text-paper/50">Illustrative example only — not live monitoring data.</p>
          </div>
          <div className="border border-white/10 bg-white/[0.025] p-6 sm:p-8 md:col-span-7 md:col-start-6">
            <StatusBars label="FlinT AI Labs" days={days} loading={!today} locale="en-US" />
          </div>
        </div>
      </div>
    </section>
  );
}
