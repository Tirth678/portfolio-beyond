import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-center">
      <div className="shell py-32">
        <p className="section-label">Error 404</p>
        <h1 className="mt-8 max-w-3xl font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] tracking-[-0.03em]">
          This page went
          <br />
          <em className="text-accent/90">somewhere quieter.</em>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-7 text-paper/55">
          The work you are looking for has moved, or never existed. The way back
          is this way.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-3 border-b border-accent/40 pb-2 font-mono text-[10px] tracking-[0.18em] text-accent uppercase transition-colors hover:border-accent"
        >
          Back to the journal <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
