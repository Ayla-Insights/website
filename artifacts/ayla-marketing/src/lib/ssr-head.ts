// Build-time only: a sink for the per-page SEO data captured during
// renderToString. useSEO() writes here synchronously when there's no DOM
// (i.e. during prerendering); the prerender script reads it back per route to
// emit page-specific <title>/meta/canonical/JSON-LD into the static HTML.
//
// This is never imported on the client path — useSEO only touches it behind a
// `typeof document === "undefined"` guard, so it tree-shakes out of the browser
// bundle.

export interface CapturedSeo {
  title: string;
  description: string;
  path: string;
  type: "website" | "article";
  publishedAt?: string;
  fullTitleOverride?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

let captured: CapturedSeo | null = null;

export function captureSeo(seo: CapturedSeo): void {
  captured = seo;
}

/** Return the last captured SEO and clear it (one render pass = one page). */
export function takeSeo(): CapturedSeo | null {
  const seo = captured;
  captured = null;
  return seo;
}
