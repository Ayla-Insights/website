import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  publishedAt?: string;
}

const SITE_NAME = "Ayla Insights";
const BASE_URL = "https://aylainsights.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSEO({ title, description, path = "", type = "website", publishedAt }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
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

    // Article published date
    if (publishedAt) {
      setMeta("article:published_time", publishedAt, "property");
    }
  }, [title, description, path, type, publishedAt]);
}
