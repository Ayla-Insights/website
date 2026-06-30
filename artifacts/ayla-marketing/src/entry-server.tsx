// Build-time server entry for prerendering. Vite builds this as an SSR bundle
// (dist/server/entry-server.js); scripts/prerender.mjs imports render()/routes
// to emit one static HTML file per route. Not shipped to the browser.
import { renderToString } from "react-dom/server";
import App from "./App";
import { takeSeo } from "./lib/ssr-head";
import { posts } from "./data/posts";
import { integrations } from "./data/pms";

const SITE_NAME = "Mandi";
const BASE_URL = "https://heymandi.ai";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.png`;

// Every route we emit static HTML for. Static pages + one per resource post.
// The catch-all rewrite (/* -> /index.html) still covers anything not listed.
export const routes: string[] = [
  "/",
  "/features",
  "/dentrix",
  "/security",
  "/pricing",
  "/about",
  "/demo",
  "/legal/privacy",
  "/legal/terms",
  "/resources",
  ...integrations.map((p) => `/${p.slug}`),
  ...posts.map((p) => `/resources/${p.slug}`),
];

export interface RenderedPage {
  html: string;
  fullTitle: string;
  description: string;
  url: string;
  ogImage: string;
  type: "website" | "article";
  publishedAt?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function render(path: string): RenderedPage {
  const html = renderToString(<App ssrPath={path} />);
  const seo = takeSeo();
  const title = seo?.title ?? "AI Copilot for the Dental Office";
  return {
    html,
    fullTitle: seo?.fullTitleOverride ?? `${title} — ${SITE_NAME}`,
    description: seo?.description ?? "",
    url: `${BASE_URL}${seo?.path ?? path}`,
    ogImage: DEFAULT_OG_IMAGE,
    type: seo?.type ?? "website",
    publishedAt: seo?.publishedAt,
    jsonLd: seo?.jsonLd,
  };
}
