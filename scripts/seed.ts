import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { getPortfolio } from '../lib/content.ts';
import { getFiles } from '../lib/storage.ts';

const connectionString =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL_UNPOOLED / DATABASE_URL is missing. Run `neon env pull` first.',
  );
}

// Migrations use the direct (non-pooled) connection.
const sql = neon(connectionString);
const files = getFiles();

await sql`
  create table if not exists site_content (
    id text primary key,
    data jsonb not null,
    updated_at timestamptz not null default now()
  )
`;

await sql`
  create table if not exists projects (
    slug text primary key,
    sort_order integer not null,
    title text not null,
    year text not null,
    category text not null,
    client text not null,
    role text not null,
    summary text not null,
    description jsonb not null,
    cover_key text not null,
    cover_alt text not null,
    gallery jsonb not null,
    tags jsonb not null,
    featured boolean not null default false,
    updated_at timestamptz not null default now()
  )
`;

const {
  profile,
  slides,
  about,
  process: processSteps,
  contact,
  projects,
} = getPortfolio();

const sections: Array<[string, unknown]> = [
  ['profile', profile],
  ['slides', slides],
  ['about', about],
  ['process', processSteps],
  ['contact', contact],
];

for (const [id, data] of sections) {
  await sql`
    insert into site_content (id, data)
    values (${id}, ${JSON.stringify(data)}::jsonb)
    on conflict (id) do update
      set data = excluded.data,
          updated_at = now()
  `;
}

for (const [index, project] of projects.entries()) {
  await sql`
    insert into projects (
      slug, sort_order, title, year, category, client, role, summary,
      description, cover_key, cover_alt, gallery, tags, featured
    )
    values (
      ${project.slug}, ${index}, ${project.title}, ${project.year},
      ${project.category}, ${project.client}, ${project.role},
      ${project.summary}, ${JSON.stringify(project.description)}::jsonb,
      ${project.cover}, ${project.coverAlt},
      ${JSON.stringify(project.gallery)}::jsonb,
      ${JSON.stringify(project.tags)}::jsonb, ${project.featured}
    )
    on conflict (slug) do update
      set sort_order = excluded.sort_order,
          title = excluded.title,
          year = excluded.year,
          category = excluded.category,
          client = excluded.client,
          role = excluded.role,
          summary = excluded.summary,
          description = excluded.description,
          cover_key = excluded.cover_key,
          cover_alt = excluded.cover_alt,
          gallery = excluded.gallery,
          tags = excluded.tags,
          featured = excluded.featured,
          updated_at = now()
  `;
}

const imageNames = ['notes', 'philosophy', 'thoughts', 'shots', 'space'];

for (const name of imageNames) {
  const key = `portfolio/${name}.jpg`;
  const path = fileURLToPath(
    new URL(`../public/images/${name}.jpg`, import.meta.url),
  );
  const bytes = await readFile(path);

  await files.upload(key, new Uint8Array(bytes), {
    contentType: 'image/jpeg',
    cacheControl: 'public, max-age=31536000, immutable',
  });
}

const [{ count: projectCount }] = (await sql`
  select count(*)::int as count from projects
`) as Array<{ count: number }>;

console.log(
  `Seeded ${sections.length} content sections, ${projectCount} projects, and ${imageNames.length} images into bucket "${process.env.S3_BUCKET ?? 'assets'}".`,
);
