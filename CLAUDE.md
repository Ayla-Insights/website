# CLAUDE.md — Mandi marketing website

The marketing site (heymandi.ai; formerly aylainsights.com). A **pnpm workspace**
originally built on Replit; now developed locally with Claude Code, **Replit still
hosts** it (autoscale deploy). Full project overview, page map, and SEO notes live
in [replit.md](replit.md).

## Stack
React + Vite 7 + Tailwind v4 + wouter + framer-motion (frontend, `artifacts/ayla-marketing`)
· Express 5 API (`artifacts/api-server`, waitlist) · Postgres + Drizzle (`lib/db`)
· Zod + Orval codegen from `lib/api-spec/openapi.yaml`. Node 24 (Replit) — local
works on Node 24+; **pnpm** (lockfile 9.0; pnpm 11 is fine, no corepack needed).

## Local dev
The Vite config **requires `PORT` and `BASE_PATH`** env vars (Replit injects them; locally you must too):
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/ayla-marketing run dev   # frontend
pnpm --filter @workspace/api-server run dev                              # API (port 8080, /api) — needs DATABASE_URL
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/ayla-marketing run build  # prod build → dist/public
pnpm run typecheck                                                       # all packages
pnpm --filter @workspace/api-spec run codegen                           # regen API hooks/zod after openapi.yaml change
```
The frontend renders standalone (only the `/waitlist` form needs the API + `DATABASE_URL`).
`.claude/launch.json` wires the frontend for the preview tooling.

## ⚠️ Cross-platform note (don't undo this)
`pnpm-workspace.yaml` used to strip every non-Linux native binary
(`@esbuild/*`, `@rollup/*`, `lightningcss-*`, `@tailwindcss/oxide-*` for darwin/win)
— "Replit is linux-x64 only." Those exclusions were **removed** so the site builds
on macOS/arm64 too; pnpm installs only the matching platform's binary via os/cpu
gating, so Replit's linux-x64 build is unaffected. **Do not re-add the exclusions.**
Leave `minimumReleaseAge: 1440` (supply-chain guard) alone.

## Hosting / workflow
GitHub is the source of truth. Develop locally → push → Replit deploys (autoscale).
**Edit in one place** (locally), not both Replit and local at once, to avoid divergence.

## Brand / copy gotchas (from replit.md — keep enforcing)
- Never write **"HIPAA compliant"** → use **"Built for HIPAA"** / "HIPAA-ready architecture".
- Dashboard/product visuals carry a visible **"Demo data"** watermark; all $ labeled estimated/typical.
- The font `@import` must be the **first line** of `index.css` (before `@import "tailwindcss"`).
- Rebrand in progress: **Ayla → Mandi**, domain **heymandi.ai**. Update copy/emails
  (`hello@`/`security@heymandi.ai`) as you touch pages.

## Open follow-up
The site is a client-rendered SPA → crawlers/LLM retrievers see little without JS.
For SEO/GEO, add SSR/prerendering (or migrate to Astro) so page content is in the HTML.
