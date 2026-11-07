# Tirth S Pandya — Portfolio

An end-to-end portfolio built with **Next.js 16 (App Router)**, backed by
**Neon Postgres** for all text and **Neon Object Storage** for imagery.

The hero is a WebGL image slider (three.js + GSAP). Slides, projects, about,
process and contact copy are read from Postgres; images live in the private
`assets` bucket and are streamed through the app at `/api/images/...`.

## Run it

```bash
npm install
npm run seed     # create tables, load content, upload images (idempotent)
npm run dev      # http://localhost:3000
```

Without credentials, the app runs with the bundled seed content and images; seeding is optional for local development. `npm run seed` reads `DATABASE_URL_UNPOOLED` and the `AWS_*` variables from `.env.local`. The app itself uses the pooled `DATABASE_URL`.

```bash
npm run build    # production build (prerenders pages from Postgres)
npm start        # serve the production build
```

## Infrastructure

Managed with [neon.ts](neon.ts) via the Neon CLI:

```bash
neon deploy      # apply buckets/services and pull env vars
neon env pull    # refresh credentials in .env.local
```

| Service | Used for | Env vars |
| --- | --- | --- |
| Postgres | `site_content` + `projects` tables | `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (migrations) |
| Object Storage | private `assets` bucket, key prefix `portfolio/` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `S3_BUCKET` |

`.env.local` is gitignored; never commit it. `NEXT_PUBLIC_SITE_URL` sets the
absolute origin used for Open Graph metadata. If unset, the app uses Vercel's
`VERCEL_PROJECT_PRODUCTION_URL` when available, or localhost for local development.

## Content workflow

The database is the source of truth at runtime, except for the profile email,
social links and Philosophy introduction and image, which are maintained in `lib/content.ts`
and override database values so they stay consistent across the site.

- **Text** lives in `site_content` (`profile`, `slides`, `about`, `process`,
  `contact`) as JSONB.
- **Projects** live in the `projects` table; image columns store object keys,
  never bytes.
- **Seed data** lives in [lib/content.ts](lib/content.ts). `npm run seed`
  upserts it into Postgres and re-uploads the images, so it both bootstraps a
  fresh branch and resets edits. Change the seed file first if you want content
  reproducible.

Images are uploaded from [public/images](public/images) to
`portfolio/<name>.jpg`. Replacing an image means uploading a new object and
updating the key in Postgres — after which the app serves it through
`/api/images/<key>`.

## Backend API

| Endpoint | Returns |
| --- | --- |
| `GET /api/portfolio` | Profile, slides, projects, about, process, contact |
| `GET /api/projects` | `{ count, categories, projects }` |
| `GET /api/projects?category=Photography` | Projects filtered by category |
| `GET /api/projects/<slug>` | `{ project, next, previous }`, 404 if unknown |
| `GET /api/images/<key>` | Streams a private object from the `assets` bucket |

Pages render on the server from Postgres with a 5-minute revalidation window;
the work filter fetches `/api/projects?category=` in the browser. The image route
sets long-lived cache headers and only exposes keys under `portfolio/`.

## Structure

```
app/
  layout.tsx                 header/footer + metadata (profile from Postgres)
  page.tsx                   home sections, ISR every 5 minutes
  work/[slug]/page.tsx       prerendered project pages
  api/…                      content + image routes
components/                  hero slider, work grid, about, process, contact
lib/
  data.ts                    Postgres repository + object-key → URL mapping
  storage.ts                 Neon object-storage client (Files SDK)
  content.ts                 seed content
  types.ts                   shared types
scripts/seed.ts              schema + seed + image upload
neon.ts                      bucket policy
```

## Deploy

Deploy the Next.js app to Vercel or any Next host, then add the Postgres and
storage environment variables to that host (`neon env pull` prints the names).
Run the schema/seed once against the production branch. No other external
service is required.

**Placeholders to replace:** some profile details, stats and project copy in
`lib/content.ts` are sample content.
