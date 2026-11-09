import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { getSubstackPosts, SUBSTACK_URL } from '@/lib/substack';

export const metadata: Metadata = {
  title: 'Thoughts',
  description: 'Essays and reflections by Tirth, published on Substack.',
};

const dateFormatter = new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

export default async function ThoughtsPage() {
  // Render on request so an unavailable feed at build time doesn't freeze an
  // empty page into the deployment. Successful feed responses are cached.
  await connection();
  const { posts, unavailable } = await getSubstackPosts();
  const [featured, ...archive] = posts;

  return (
    <main className="pt-[76px]">
      <div className="shell pt-10">
        <div data-reveal className="flex items-center justify-between gap-6 font-mono text-[10px] tracking-[0.18em] text-paper/50 uppercase">
          <Link href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-paper">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span> All chapters
          </Link>
          <span className="text-paper/30">03 / 05</span>
        </div>

        <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8" data-reveal>
            <p className="section-label">03 — After dark</p>
            <h1 className="mt-6 font-display text-[clamp(4rem,14vw,11rem)] leading-[0.82] tracking-[-0.04em]">Thoughts<span className="text-accent">.</span></h1>
          </div>
          <div data-reveal className="max-w-sm md:col-span-4 md:pb-2">
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">Thoughts × Substack</p>
            <p className="mt-4 text-sm leading-7 text-paper/55">A collection of ideas and reflections, published on Substack.</p>
            <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex border-b border-accent/50 pb-2 font-mono text-[10px] tracking-[0.16em] text-paper uppercase transition-colors hover:text-accent">Visit the publication <span aria-hidden="true" className="ml-3">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>

        <section aria-labelledby="writing-heading" className="mt-14 border-t border-white/10 pb-20 pt-8 md:mt-20 md:pb-28">
          <div data-reveal className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] tracking-[0.2em] uppercase">
            <h2 id="writing-heading" className="text-accent">The writing</h2>
            <span className="text-paper/35">Published on Substack ↗</span>
          </div>

          {featured ? (
            <>
              <a href={featured.url} target="_blank" rel="noopener noreferrer" data-reveal className="group mt-8 block border-y border-white/10 py-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:py-16">
                <div className="grid gap-8 md:grid-cols-12">
                  <div className="font-mono text-[10px] tracking-[0.18em] text-paper/40 uppercase md:col-span-3">
                    <span className="text-accent">01 / Latest essay</span>
                    {featured.date && <time dateTime={featured.date} className="mt-4 block">{dateFormatter.format(new Date(featured.date))}</time>}
                  </div>
                  <div className="md:col-span-8">
                    <h3 className="max-w-4xl font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.98] tracking-[-0.03em] transition-colors group-hover:text-accent">{featured.title}</h3>
                    {featured.excerpt && <p className="mt-6 max-w-xl text-sm leading-7 text-paper/55">{featured.excerpt}</p>}
                    <span className="mt-8 inline-block font-mono text-[10px] tracking-[0.18em] text-paper/55 uppercase">Read on Substack <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></span>
                  </div>
                  <span aria-hidden="true" className="hidden text-right text-2xl text-paper/35 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:col-span-1 md:block">↗</span>
                </div>
              </a>
              {archive.length > 0 && <div className="mt-12 md:mt-16">
                <p className="mb-5 font-mono text-[10px] tracking-[0.2em] text-paper/35 uppercase">More from the archive</p>
                {archive.map((post, index) => (
                  <a key={post.url} href={post.url} target="_blank" rel="noopener noreferrer" data-reveal className="group grid gap-3 border-t border-white/10 py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:grid-cols-12 md:gap-6 md:py-9">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-paper/35 uppercase md:col-span-3">{String(index + 2).padStart(2, '0')} {post.date && <> / <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time></>}</span>
                    <div className="md:col-span-8"><h3 className="font-display text-[clamp(2rem,3.3vw,3.5rem)] leading-[1.05] transition-colors group-hover:text-accent">{post.title}</h3>{post.excerpt && <p className="mt-3 max-w-xl text-sm leading-7 text-paper/50">{post.excerpt}</p>}</div>
                    <span aria-hidden="true" className="hidden text-right text-paper/35 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:col-span-1 md:block">↗</span><span className="sr-only"> Opens on Substack in a new tab.</span>
                  </a>
                ))}
                <div className="border-t border-white/10" />
              </div>}
            </>
          ) : (
            <div className="mt-8 border-y border-white/10 py-16">
              <p className="font-display text-3xl italic text-paper/70">{unavailable ? 'The writing is taking a moment to load.' : 'More thoughts on the way.'}</p>
              <p className="mt-4 text-sm leading-7 text-paper/50">{unavailable ? 'You can still read the latest posts directly on Substack.' : 'Visit the publication to follow along.'}</p>
              <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block border-b border-accent/50 pb-2 font-mono text-[10px] tracking-[0.16em] text-paper uppercase hover:text-accent">Visit Substack ↗<span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          )}
        </section>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-wrap items-center justify-between gap-8 py-14 md:py-20">
          <div><p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">Stay in the loop</p><p className="mt-3 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none">More thoughts, in your inbox.</p></div>
          <a href={`${SUBSTACK_URL}/subscribe`} target="_blank" rel="noopener noreferrer" className="border border-white/25 px-6 py-4 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent">Subscribe on Substack ↗<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
    </main>
  );
}
