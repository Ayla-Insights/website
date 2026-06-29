import { useEffect } from "react";
import { captureSeo } from "@/lib/ssr-head";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  publishedAt?: string;
  /** Full <title> override. When omitted, title is suffixed with the site name. */
  fullTitleOverride?: string;
  /** Optional JSON-LD structured data injected for this page. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = "Mandi";
const BASE_URL = "https://heymandi.ai";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.png`;

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSEO({ title, description, path = "", type = "website", publishedAt, fullTitleOverride, jsonLd }: SEOProps) {
  // During build-time prerendering there's no DOM and effects don't run, so
  // record this page's SEO synchronously for the prerender script to emit.
  if (typeof document === "undefined") {
    captureSeo({ title, description, path, type, publishedAt, fullTitleOverride, jsonLd });
  }

  useEffect(() => {
    const fullTitle = fullTitleOverride ?? `${title} — ${SITE_NAME}`;
    const url = `${BASE_URL}${path}`;

    document.title = fullTitle;

    // Standard
    setMeta("description", description);

    // Open Graph
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("og:url", url, "property");
    setMeta("og:image", DEFAULT_OG_IMAGE, "property");
    setMeta("og:site_name", SITE_NAME, "property");

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", DEFAULT_OG_IMAGE);

    // Canonical
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Article published date (clear stale value on non-article pages)
    if (publishedAt) {
      setMeta("article:published_time", publishedAt, "property");
    } else {
      document.querySelector('meta[property="article:published_time"]')?.remove();
    }

    // JSON-LD structured data (page-scoped)
    const SCRIPT_ID = "page-jsonld";
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = SCRIPT_ID;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const node = document.getElementById(SCRIPT_ID);
      if (node) node.remove();
    };
  }, [title, description, path, type, publishedAt, fullTitleOverride, jsonLd]);
}
