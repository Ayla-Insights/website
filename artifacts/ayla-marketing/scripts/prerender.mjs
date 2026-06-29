// Post-build prerender: render every route to static HTML so crawlers and LLM
// retrievers get real content (and per-page <title>/meta) instead of the empty
// SPA shell. Runs after `vite build` (client -> dist/public) and the SSR build
// (-> dist/server). The client bundle still mounts on top via createRoot, so
// the page stays a normal SPA after first paint.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const publicDir = resolve(root, "dist/public");

const { render, routes } = await import(resolve(root, "dist/server/entry-server.js"));

const template = readFileSync(resolve(publicDir, "index.html"), "utf8");

const escAttr = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escText = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Replace the content="" of a <meta> matched by name|property, in place. */
function setMeta(html, attr, value, content) {
  const re = new RegExp(`(<meta\\s+${attr}="${value}"\\s+content=")[^"]*(")`, "i");
  return re.test(html) ? html.replace(re, `$1${escAttr(content)}$2`) : html;
}

function buildHead(html, page) {
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escText(page.fullTitle)}</title>`);
  out = setMeta(out, "name", "description", page.description);
  out = setMeta(out, "property", "og:title", page.fullTitle);
  out = setMeta(out, "property", "og:description", page.description);
  out = setMeta(out, "property", "og:type", page.type);
  out = setMeta(out, "property", "og:url", page.url);
  out = setMeta(out, "property", "og:image", page.ogImage);
  out = setMeta(out, "name", "twitter:title", page.fullTitle);
  out = setMeta(out, "name", "twitter:description", page.description);
  out = setMeta(out, "name", "twitter:image", page.ogImage);
  out = out.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${escAttr(page.url)}$2`);

  // Inject page-scoped extras right before </head>.
  const extras = [];
  if (page.publishedAt) {
    extras.push(`<meta property="article:published_time" content="${escAttr(page.publishedAt)}" />`);
  }
  if (page.jsonLd) {
    extras.push(
      `<script type="application/ld+json" id="page-jsonld">${JSON.stringify(page.jsonLd)}</script>`,
    );
  }
  if (extras.length) out = out.replace("</head>", `    ${extras.join("\n    ")}\n  </head>`);
  return out;
}

function outFile(route) {
  if (route === "/") return resolve(publicDir, "index.html");
  return resolve(publicDir, `${route.replace(/^\//, "")}.html`);
}

let count = 0;
for (const route of routes) {
  let page;
  try {
    page = render(route);
  } catch (err) {
    console.error(`✗ prerender failed for ${route}:`, err?.message ?? err);
    process.exitCode = 1;
    continue;
  }
  let out = buildHead(template, page);
  out = out.replace('<div id="root"></div>', `<div id="root">${page.html}</div>`);

  const file = outFile(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, out);
  count++;
  console.log(`✓ ${route} -> ${file.replace(publicDir + "/", "")}`);
}
console.log(`\nPrerendered ${count}/${routes.length} routes into dist/public.`);
