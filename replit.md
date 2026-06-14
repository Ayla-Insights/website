# Ayla Insights — Marketing Website

Marketing website for Ayla Insights (aylainsights.com), an AI copilot for dental front offices that finds unscheduled treatment, schedule gaps, and lapsed recall.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/ayla-marketing run dev` — run the marketing frontend (proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + wouter + framer-motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Font: Inter via fonts.bunny.net (not Google Fonts)

## Where things live

- `artifacts/ayla-marketing/src/` — marketing frontend
  - `pages/` — one file per route (Home, Product, Security, Pricing, About, Book, Waitlist, Blog, legal/*)
  - `components/Layout.tsx` — shared nav + footer
  - `index.css` — Ayla brand tokens (teal #0d9488 primary)
- `artifacts/api-server/src/routes/waitlist.ts` — POST /api/waitlist endpoint
- `lib/db/src/schema/waitlist.ts` — waitlist table schema
- `lib/api-spec/openapi.yaml` — API contract (source of truth)

## Pages

| Route | Purpose |
|---|---|
| / | Home — hero, opportunity buckets, how it works, trust, security teaser |
| /features | What Ayla does — dashboard walkthrough, Ask Ayla chat, booking flow, audit trail (was /product) |
| /dentrix | Dentrix-focused SEO landing page (analytics, integration, reporting) |
| /security | HIPAA-ready posture — what's built in, what's coming before launch |
| /pricing | Pre-launch pricing page with CTAs |
| /about | Mission + founder bio |
| /demo | Discovery call booking (Cal.com embed placeholder) (was /book) |
| /waitlist | Email capture form (saves to DB via /api/waitlist) |
| /legal/privacy | Privacy policy |
| /legal/terms | Terms of service |
| /resources | Blog/resources hub — 3 posts live (was /blog) |
| /resources/:slug | Individual post (was /blog/:slug) |

Legacy URLs `/product`, `/book`, `/blog`, `/blog/:slug` client-redirect (wouter `<Redirect>`) to their new paths.

## Architecture decisions

- This is a frontend-only marketing site (no auth, no user accounts) with one lightweight API endpoint for waitlist captures.
- Waitlist submissions are stored in PostgreSQL via the shared API server.
- Font loaded from fonts.bunny.net to avoid Google Fonts privacy concerns (healthcare audience).
- "HIPAA compliant" never appears anywhere — always "Built for HIPAA" or "HIPAA-ready architecture".
- All dashboard/product visuals are code-drawn (no images) and carry a "Demo data" badge.

## TBDs to fill in

- [ ] Domain name + DNS
- [ ] Real logo (replace wordmark component in `components/Layout.tsx`)
- [ ] Founder bio for /about
- [ ] Calendar link for /demo (Cal.com or Calendly URL)
- [ ] Email addresses: hello@aylainsights.com, security@aylainsights.com
- [ ] Legal review (privacy policy and terms marked "Reviewed by counsel: pending")

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## SEO

- Per-page `<title>`/meta/canonical/OG/JSON-LD handled by `src/hooks/useSEO.ts`. Pass `fullTitleOverride` to set an exact title (else `title` is suffixed with " — Ayla Insights"); pass `jsonLd` for page-scoped structured data.
- Title format follows the SEO brief: each page pairs its topic with the "Ayla Insights" brand + dental context; titles ≤60 chars, meta ≤155 chars.
- Org + WebSite JSON-LD live statically in `index.html`; Home injects SoftwareApplication schema via `useSEO`.
- `public/sitemap.xml` lists canonical (new) URLs only — update it when routes change.

## Gotchas

- Never use "HIPAA compliant" — use "Built for HIPAA" or "HIPAA-ready architecture"
- Dashboard visuals must always carry a visible "Demo data" watermark
- Page files were renamed to match routes (Features/Demo/Resources/ResourcePost/Dentrix); old route paths only survive as redirects in App.tsx
- Font import must be the very first line of index.css (before @import "tailwindcss")
- Always run codegen after OpenAPI spec changes: `pnpm --filter @workspace/api-spec run codegen`
