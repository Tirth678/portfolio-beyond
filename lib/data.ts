import { neon } from '@neondatabase/serverless';
import * as seed from './content';
import type {
  About,
  Contact,
  HeroSlide,
  PortfolioContent,
  ProcessStep,
  Profile,
  Project,
} from './types';

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

type ProjectRow = {
  slug: string;
  title: string;
  year: string;
  category: string;
  client: string;
  role: string;
  summary: string;
  description: string[];
  cover_key: string;
  cover_alt: string;
  gallery: { src: string; alt: string }[];
  tags: string[];
  featured: boolean;
};

/** Object keys live in Postgres; the browser reads them through this app. */
export function mediaUrl(key: string) {
  if (key.startsWith('/') || key.startsWith('http')) return key;
  return `/api/images/${key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;
}

function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    year: row.year,
    category: row.category === 'Space' ? 'Eternity' : row.category,
    client: row.client,
    role: row.role,
    summary: row.summary,
    description: row.description,
    cover: mediaUrl(row.cover_key),
    coverAlt: row.cover_alt,
    gallery: row.gallery.map((image) => ({ ...image, src: mediaUrl(image.src) })),
    tags: row.tags,
    featured: row.featured,
  };
}

function decorateProject(project: Project): Project {
  return {
    ...project,
    category: project.category === 'Space' ? 'Eternity' : project.category,
    cover: mediaUrl(project.cover),
    gallery: project.gallery.map((image) => ({
      ...image,
      src: mediaUrl(image.src),
    })),
  };
}

/** Keep the selected chapter artwork consistent with both seeded and database slides. */
function decorateSlide(slide: HeroSlide): HeroSlide {
  if (slide.id === 'shots') {
    return { ...slide, image: '/images/shots-hero.jpg', alt: 'A Gothic cathedral rising into a misty sky' };
  }
  if (slide.id === 'space') {
    return { ...slide, title: 'Eternity', image: '/images/eternity-night-sky.jpg', alt: 'The Milky Way above clouds in a black-and-white night sky' };
  }
  return { ...slide, image: mediaUrl(slide.image) };
}

function decoratePortfolio(content: PortfolioContent): PortfolioContent {
  return {
    ...content,
    slides: content.slides.map(decorateSlide),
    projects: content.projects.map(decorateProject),
    about: { ...content.about, image: mediaUrl(content.about.image) },
  };
}

async function readContent<T>(id: string): Promise<T | null> {
  if (!sql) return null;
  const rows = (await sql`
    select data from site_content where id = ${id}
  `) as Array<{ data: T }>;
  return rows[0]?.data ?? null;
}

async function readProjectRows(): Promise<ProjectRow[]> {
  if (!sql) return [];
  return (await sql`
    select slug, title, year, category, client, role, summary, description,
           cover_key, cover_alt, gallery, tags, featured
    from projects
    order by sort_order asc
  `) as ProjectRow[];
}

export async function getPortfolio(): Promise<PortfolioContent> {
  if (!sql) return decoratePortfolio(seed.getPortfolio());

  const [profile, slides, about, process, contact, projectRows] =
    await Promise.all([
      readContent<Profile>('profile'),
      readContent<HeroSlide[]>('slides'),
      readContent<About>('about'),
      readContent<ProcessStep[]>('process'),
      readContent<Contact>('contact'),
      readProjectRows(),
    ]);

  if (!profile || !slides || !about || !process || !contact || !projectRows.length) {
    return decoratePortfolio(seed.getPortfolio());
  }

  return {
    profile,
    slides: slides.map(decorateSlide),
    projects: projectRows.map(toProject),
    about: { ...about, image: mediaUrl(about.image) },
    process,
    contact,
  };
}

export async function getProfile(): Promise<Profile> {
  const profile = sql ? await readContent<Profile>('profile') : null;
  return profile ?? seed.getProfile();
}

export async function getProjects(category?: string | null): Promise<Project[]> {
  const projects = sql
    ? (await readProjectRows()).map(toProject)
    : seed.getProjects('all').map(decorateProject);

  if (!category || category.toLowerCase() === 'all') return projects;
  return projects.filter(
    (project) => project.category.toLowerCase() === category.toLowerCase(),
  );
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getAdjacentProjects(slug: string) {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { next: undefined, previous: undefined };
  return {
    next: projects[(index + 1) % projects.length],
    previous: projects[(index - 1 + projects.length) % projects.length],
  };
}

export function categoriesOf(projects: Project[]): string[] {
  const chapterOrder = seed.getSlides().map((slide) => slide.title);

  return Array.from(
    new Set(projects.map((project) => project.category)),
  ).sort((a, b) => {
    const indexA = chapterOrder.indexOf(a);
    const indexB = chapterOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}
