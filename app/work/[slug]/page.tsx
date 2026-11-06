import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAdjacentProjects,
  getProfile,
  getProject,
  getProjects,
} from '@/lib/data';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: 'Project not found' };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.cover, alt: project.coverAlt }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const profile = await getProfile();
  const { next } = await getAdjacentProjects(slug);

  return (
    <main className="pt-[76px]">
      <div className="shell pt-10">
        <Link
          href="/#notes"
          className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-paper/50 uppercase transition-colors hover:text-paper"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          All work
        </Link>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
              {project.category} — {project.year}
            </p>
            <h1 className="mt-4 font-display text-[clamp(3.2rem,9vw,8rem)] leading-[0.86] tracking-[-0.04em]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-paper/60">
              {project.summary}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 md:col-span-4 md:grid-cols-2 md:border-t-0 md:pt-0">
            <div>
              <dt className="font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">
                Year
              </dt>
              <dd className="mt-1.5 text-sm text-paper/75">{project.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">
                Client
              </dt>
              <dd className="mt-1.5 text-sm text-paper/75">{project.client}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">
                Role
              </dt>
              <dd className="mt-1.5 text-sm text-paper/75">{project.role}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="shell mt-12">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5 md:aspect-[16/8]">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <p className="mt-3 font-mono text-[9px] tracking-[0.18em] text-paper/30 uppercase">
          Cover — {project.coverAlt}
        </p>
      </div>

      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="space-y-6 md:col-span-7">
          {project.description.map((paragraph) => (
            <p key={paragraph.slice(0, 36)} className="text-[15px] leading-8 text-paper/65">
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          <p className="font-mono text-[10px] tracking-[0.2em] text-paper/35 uppercase">
            Disciplines
          </p>
          <ul className="mt-4">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-paper/70"
              >
                {tag}
                <span aria-hidden="true" className="font-mono text-[10px] text-accent/70">
                  +
                </span>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent(
              `Project enquiry — ${project.title}`,
            )}`}
            className="group mt-10 inline-flex items-center gap-3 border-b border-accent/40 pb-2 font-mono text-[10px] tracking-[0.18em] text-accent uppercase transition-colors hover:border-accent"
          >
            Start a similar project
            <span
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </aside>
      </div>

      <div className="shell grid gap-6 pb-20 md:grid-cols-2 md:gap-8">
        {project.gallery.map((image, index) => (
          <div
            key={image.src + index}
            className={`relative aspect-[4/3] overflow-hidden bg-white/5 ${
              index % 2 === 1 ? 'md:mt-16' : ''
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {next ? (
        <div className="border-t border-white/10">
          <Link
            href={`/work/${next.slug}`}
            className="shell group flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-20"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-paper/35 uppercase">
                Next project
              </p>
              <p className="mt-3 font-display text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-[-0.03em] transition-colors duration-500 group-hover:text-accent">
                {next.title}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] tracking-[0.16em] text-paper/40 uppercase">
                {next.category} — {next.year}
              </span>
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-lg transition-all duration-500 group-hover:translate-x-1 group-hover:border-accent group-hover:text-accent"
              >
                →
              </span>
            </div>
          </Link>
        </div>
      ) : null}
    </main>
  );
}
