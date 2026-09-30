# Drafting Studio

A marketing site, client portal and admin dashboard for **Drafting Studio**, a US-focused **2D AutoCAD** design and drafting service (MEP, fire protection and lighting).

> **Scope:** 2D AutoCAD drafting only — no Revit, BIM or 3D anywhere in the product or the copy.
>
> **No published prices.** Every job is quoted individually, so no rate, range or "from $X" appears on the public site. The admin keeps quoted amounts internally.

## Stack

- **Next.js 16.3** (App Router, RSC, Server Actions, Turbopack) on **React 19** + TypeScript 5
- **Tailwind CSS v4** with hand-built shadcn-style components over Radix primitives
- **Prisma 6** → SQLite in dev, Postgres in production (same schema)
- **Auth.js v5** credentials auth, roles `ADMIN` / `STAFF` / `CLIENT`, enforced in middleware
- **next-mdx-remote** renders article bodies server-side; **react-markdown** drives the admin editor's live preview
- **sharp** for image processing, **nodemailer** for mail, **Recharts** for the admin RFQ chart

## Getting started

```bash
npm install
cp .env.example .env          # then set AUTH_SECRET (npx auth secret)
npm run db:push               # create the SQLite schema
npm run db:seed               # seed content + demo accounts
npm run dev                   # http://localhost:3000
```

### Demo accounts

Seeded for local development. The login page shows one-click buttons for the
first two, and both the buttons and the credentials are hidden when
`NODE_ENV=production`.

| Role   | Email                          | Password    |
| ------ | ------------------------------ | ----------- |
| Admin  | admin@draftingstudio.example   | Admin123!   |
| Staff  | priya@draftingstudio.example   | Staff123!   |
| Client | client@acme.example            | Client123!  |

## Content lives in the database

**Every public page reads from the database**, never from a file at request time.
Posts, services, industries and projects are Prisma rows.

Those rows get there two different ways, and the distinction matters:

1. **Seed content files** — `prisma/content/*.ts` hold the canonical copy as
   TypeScript. Editing one changes nothing on the site until a sync runs.
2. **The admin dashboard** — `/admin` writes straight to the database.

`prisma/seed.ts` **clears every table** before it writes, so it is only for a
fresh database. To publish a content-file change against a live database, use
the targeted syncs, which leave unrelated rows alone:

```bash
npx tsx prisma/sync-posts.ts            # insert posts that are missing
npx tsx prisma/sync-posts.ts --refresh  # also rewrite existing posts' copy
npx tsx prisma/sync-services.ts         # services, including deletions
npx tsx prisma/sync-industries.ts       # industries (never touches heroImage)
npx tsx prisma/fix-project-covers.ts    # point covers/heroes at real photos
```

`--refresh` overwrites the title, excerpt, body, template and read time of
posts that already exist, so an edit made only in the admin will be lost. It
never touches publishing state, view counts or cover images.

> **Note:** importing anything from `prisma/seed.ts` runs it, wiping the
> database as a side effect. Shared helpers live in `prisma/photos.ts` instead.

## Images

| Kind | Path | Referenced as |
| --- | --- | --- |
| Project covers | `public/projects/<slug>.<ext>` | `coverImage` |
| Blog covers | `public/generated/blog/<slug>.webp` | `coverImage` + `ogImage` |
| Blog inline figures | `public/generated/blog/inline/<slug>-1.webp` | markdown in the body |
| Industry heroes | `public/generated/industries/<slug>.<ext>` | `heroImage` |

`prisma/photos.ts` resolves these, preferring `.webp` then `.jpg`, `.jpeg`,
`.png`. Drop a file in with the matching slug and run `fix-project-covers.ts`
to pick it up; the seed prefers a real photo over generated art automatically.

Nothing renders above **1600px**, so source images are re-encoded to that width
at quality 82 before being committed. Anything larger is dead weight.

## What's inside

**Marketing site** — home, 13 services across 4 category hubs, 11 industry
landings, a 25-project portfolio, blog, plus About / Process / Why Us / FAQ /
Contact / Careers and legal pages.

**Blog** — 56 posts over 6 categories, a hub, category archives and five post
templates (Standard, Technical Guide, Case Study, Listicle, Editorial) sharing
one MDX component set. Custom blocks: `<Callout type="note|tip|warning">` and
`<Checklist>`, which takes either `items="a;b;c"` or a wrapped task list.
Markdown images (`![caption](src)`) render as a captioned `<figure>` through
`next/image`. RSS at `/rss.xml`.

**RFQ pipeline** — a four-step `/request-quote` wizard with file upload,
`DS-YYYY-NNNN` reference generation and account linking. Quotes are matched to
a client portal **by email address**, since a public submission has no user id.

**Admin dashboard** (`/admin`) — bento overview with RFQ chart, a stage-tabbed
quote pipeline with bulk actions and convert-to-project, project CRUD, a
distraction-free blog editor with autosave and live preview, service and
industry editors, leads, clients, media library and settings.

**Client portal** (`/portal`) — quotes with message threads and accept/decline,
projects with a stage tracker, deliverable downloads and markup upload, files
and profile. Every query is **company-scoped** in `lib/portal.ts`, so one
client can never read another's rows.

**SEO** — canonical URLs on every page, OG and Twitter cards, JSON-LD
(`Organization`, `Service`, `FAQPage`, `CollectionPage`, `Article`), a 125-URL
sitemap and a robots.txt that blocks `/admin`, `/portal` and auth routes.

## Key files

| Path | Purpose |
| --- | --- |
| `lib/theme.ts` | Brand identity — the one file to edit when rebranding |
| `app/globals.css` | Design tokens (navy + amber, light and dark) |
| `lib/taxonomy.ts` | Disciplines, industries, categories, US states |
| `prisma/schema.prisma` | 29 models, portable SQLite ↔ Postgres |
| `prisma/content/*.ts` | Canonical seed copy for posts, services, industries, projects |
| `prisma/photos.ts` | Where real photography lives (no side effects) |
| `lib/queries.ts` · `lib/portal.ts` · `lib/admin.ts` | Data access layers |
| `app/actions/*` | Server actions (auth, leads, quotes, admin, portal) |
| `components/mdx/mdx-components.tsx` | Custom MDX blocks used in article bodies |

## Scripts

```bash
npm run dev         # dev server on :3000
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run db:studio   # Prisma Studio
npm run db:reset    # wipe and re-seed — destroys all data
```

## Deploying

1. Set `datasource.provider = "postgresql"` in `prisma/schema.prisma`.
2. Point `DATABASE_URL` at Postgres; set a real `AUTH_SECRET` and
   `NEXT_PUBLIC_SITE_URL` (the latter drives canonicals and OG URLs).
3. `npx prisma migrate deploy`, then `npm run db:seed` on a fresh database.
4. Set the SMTP vars. Without them, submissions still persist — the message is
   logged to the server console instead of sent.
5. Swap the local `StorageAdapter` in `lib/storage.ts` for S3, Vercel Blob or
   UploadThing.

## Notes

- Client project artwork under `public/generated/drawings/` is still generated
  SVG. Replace it with real 2D exports through the admin media library.
- Legal pages carry placeholder text; have counsel review before launch.
- `npm audit` reports issues in `next-auth`, `@auth/core`, `nodemailer` and
  `prisma` whose only fixes are semver-major. They need a deliberate upgrade
  rather than a patch.
