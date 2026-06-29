/**
 * @workspace/teaser-core — the pure, zod-only engine + no-PHI egress guard for
 * the Tier-1 "Hidden Revenue Report" teaser. Ported wholesale from the app repo
 * (`packages/shared/src/{phi-egress,teaser,teaser-core}.ts`) so the marketing
 * site's teaser page AND the api-server's aggregate endpoint share ONE source of
 * truth for the strict egress allowlist (ONRAMP_DESIGN §6a / control SC-12).
 */
export * from './phi-egress.js';
export * from './teaser.js';
export * from './teaser-core.js';
