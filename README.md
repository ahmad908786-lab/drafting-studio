# Drafting Studio

A full-stack marketing site + client portal + admin dashboard for **Drafting Studio**, a US-focused **2D AutoCAD** design & drafting service (MEP, fire protection & lighting).

> **Scope:** 2D AutoCAD drafting only — no Revit, BIM, or 3D anywhere in the product or copy.

## Stack

- **Next.js 16** (App Router, RSC, Server Actions) + TypeScript
- **Tailwind CSS v4** + hand-built shadcn-style UI (Radix primitives)
- **Prisma 6** → SQLite (dev) / Postgres (prod)
- **Auth.js v5** (credentials, role-based: `ADMIN` / `STAFF` / `CLIENT`)
- **next-mdx-remote** for blog/MDX, **Recharts** for dashboard charts

## Getting started

```bash
npm install
cp .env.example .env          # then set AUTH_SECRET (npx auth secret)
npm run db:push               # create the SQLite schema
npm run db:seed               # seed demo content + accounts
npm run dev                   # http://localhost:3000
```

### Demo accounts

| Role   | Email                          | Password    |
| ------ | ------------------------------ | ----------- |
| Admin  | admin@draftingstudio.example   | Admin123!   |
| Staff  | priya@draftingstudio.example   | Staff123!   |
| Client | client@acme.example            | Client123!  |

## What's inside

**Marketing site** — Home, 13 service pages (one DB-driven template), 4 category hubs, 12 industry landings, About / Process / Why-Us / FAQ / Contact / Careers / legal.

**★ Sample Work gallery** (`/sample-work`) — dual-axis filtering: a discipline row (Electrical · HVAC · Plumbing · Lighting · Fire Protection) combined with a 12-industry sidebar, URL-synced, searchable, sortable, paginated.

**★ Blog** — hub + category archives + 5 distinct post templates (Standard, Technical Guide, Case Study, Listicle, Editorial) sharing one MDX component set; RSS at `/rss.xml`.

**★ RFQ pipeline** — 4-step `/request-quote` wizard with file upload, `DS-YYYY-NNNN` reference generation, and account linking; plus a `/pricing-calculator`.

**★ Admin dashboard** (`/admin`) — KPI overview + charts, RFQ pipeline (status, notes, client messages, **convert-to-project**), project CRUD with stage/file management, blog editor with template picker, service & industry editors, leads, clients, content (testimonials/team), media library, settings.

**★ Client portal** (`/portal`) — dashboard, quotes with message threads + accept/decline, projects with stage tracker + deliverable downloads + markup upload, files, profile. All queries are **company-scoped** in `lib/portal.ts` — a client can never read another company's rows.

## Key files

| Path | Purpose |
| --- | --- |
| `lib/theme.ts` | Brand identity — the one file to edit when rebranding |
| `app/globals.css` | Design tokens (navy + amber, light/dark) |
| `lib/taxonomy.ts` | Disciplines, statuses, enums — source of truth |
| `prisma/schema.prisma` | Data model (portable SQLite ↔ Postgres) |
| `prisma/seed.ts` + `prisma/content/*` | Demo content + generated SVG art (`prisma/svg.ts`) |
| `lib/queries.ts` / `lib/portal.ts` / `lib/admin.ts` | Data access layers |
| `app/actions/*` | Server actions (leads, quotes, auth, admin, portal) |

## Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run db:studio   # Prisma Studio
npm run db:reset    # wipe + re-seed
npm run typecheck   # tsc --noEmit
```

## Deploying to production

1. In `prisma/schema.prisma`, set `datasource.provider = "postgresql"`.
2. Point `DATABASE_URL` at your Postgres instance; set a real `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL`.
3. `npx prisma migrate deploy` (or `db push`) + `npm run db:seed`.
4. Configure SMTP env vars to enable email (otherwise submissions log to the console and still persist).
5. Swap the local file `StorageAdapter` in `lib/storage.ts` for S3 / Vercel Blob / UploadThing.

## Notes

- Placeholder drawing art is generated SVG under `public/generated/` — replace with real 2D exports via the admin media library.
- Legal pages contain placeholder text; have counsel review before launch.
