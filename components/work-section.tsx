'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AbstractCubeIsometricLoader } from '@/components/ui/abstract-cube-isometric-loader';
import type { Project } from '@/lib/types';

type WorkSectionProps = {
  initialProjects: Project[];
  categories: string[];
};

/** Chapters that have their own page instead of filtering the grid. */
const CHAPTER_PAGES: Record<string, string> = {
  Notes: '/notes',
  Thoughts: '/thoughts',
  Shots: '/shots',
  Eternity: '/space',
  Philosophy: '/philosophy',
};

export function WorkSection({ initialProjects, categories }: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeCategory === 'All') {
      setProjects(initialProjects);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/projects?category=${encodeURIComponent(activeCategory)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json() as Promise<{ projects: Project[] }>;
      })
      .then((data) => setProjects(data.projects))
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError('That filter could not load — showing every project instead.');
        setProjects(initialProjects);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [activeCategory, initialProjects]);

  return (
    <section id="notes" className="section">
      <div className="shell">
        <div data-reveal>
          <p className="section-label">01 — Notes</p>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[clamp(2.9rem,6vw,5.4rem)] leading-[0.92] tracking-[-0.025em]">
              Work worth
              <br />
              <em className="text-accent/90">returning to.</em>
            </h2>
            <p className="max-w-xs text-sm leading-7 text-paper/55 md:pb-2">
              A selection of commissions and self-initiated studies — art
              direction, identity, photography and the web.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter work by chapter">
            {categories.map((category) => {
              const pageHref = CHAPTER_PAGES[category];

              if (pageHref) {
                return (
                  <Link
                    key={category}
                    href={pageHref}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-paper/55 uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    {category}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </Link>
                );
              }

              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-300 ${
                    isActive
                      ? 'border-accent bg-accent text-ink'
                      : 'border-white/15 text-paper/55 hover:border-white/40 hover:text-paper'
                  }`}
                >
                  {category}
                </button>
              );
            })}
            <span className="ml-auto hidden items-center gap-3 font-mono text-[10px] tracking-[0.16em] text-paper/35 uppercase sm:flex">
              {loading ? (
                <>
                  <span className="sr-only">Loading projects</span>
                  <span aria-hidden="true" className="text-accent">
                    <AbstractCubeIsometricLoader
                      dotSize={3}
                      gap={2}
                      speed={1}
                    />
                  </span>
                </>
              ) : (
                `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`
              )}
            </span>
          </div>
        </div>

        {error ? (
          <p
            role="status"
            className="mt-8 border border-white/10 px-4 py-3 font-mono text-[10px] tracking-[0.12em] text-accent uppercase"
          >
            {error}
          </p>
        ) : null}

        <div
          data-reveal
          className={`mt-14 grid gap-x-[5vw] gap-y-16 transition-opacity duration-300 md:grid-cols-2 ${
            loading ? 'opacity-40' : 'opacity-100'
          }`}
        >
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={`group block ${index % 2 === 1 ? 'md:mt-24' : ''}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                <Image
                  src={project.cover}
                  alt={project.coverAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] text-white/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="absolute top-4 right-4 translate-y-1 font-mono text-[10px] tracking-[0.18em] text-white/85 uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  View project ↗
                </span>
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-white/10 pt-4">
                <h3 className="font-display text-3xl tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent md:text-4xl">
                  {project.title}
                </h3>
                <span className="font-mono text-[10px] tracking-[0.14em] text-paper/40">
                  {project.year}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.16em] uppercase">
                <span className="text-accent/80">{project.category}</span>
                <span className="text-paper/40">{project.client}</span>
              </div>

              <p className="mt-3 max-w-md text-sm leading-6 text-paper/55">
                {project.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
