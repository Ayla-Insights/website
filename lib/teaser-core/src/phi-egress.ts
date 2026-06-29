/**
 * The single no-PHI egress guard (CLAUDE.md #3/#4; ONRAMP_DESIGN §6a; Security
 * control SC-12). One reusable primitive for every boundary where we assert
 * "no PHI leaves": the Tier-1 teaser transmit (browser → aggregate endpoint),
 * the admin-console PHI-free guard, and the WorkOS SC-12 guard.
 *
 * It is a WHITELIST, not a blacklist. We do NOT try to detect PHI by pattern
 * (names/dates/etc. are unbounded). Instead the caller passes a STRICT schema
 * describing exactly the allowed shape, and anything outside it — any extra key,
 * any wrong type — makes the guard throw rather than transmit. A PHI field added
 * upstream therefore can never leave: it's an unrecognized key.
 *
 * For this to hold, every object in the schema must be strict (reject unknown
 * keys). Build them with {@link strictObject} (or `z.object({...}).strict()`);
 * `.strip()`/`.passthrough()` would silently drop/forward extras and defeat the
 * guard.
 *
 * The thrown {@link PhiEgressError} carries only zod issue PATHS + CODES + the
 * offending KEY NAMES — never the offending VALUES, which could be the very PHI
 * we're keeping out of logs.
 */
import { z } from 'zod';

/** `z.object(shape).strict()` — the schema builder the egress guard expects. */
export function strictObject<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).strict();
}

export class PhiEgressError extends Error {
  constructor(
    message: string,
    /** Issue descriptors (path + code + key names) — contains NO field values. */
    readonly issues: string[],
  ) {
    super(`${message}: ${issues.join('; ')}`);
    this.name = 'PhiEgressError';
  }
}

/**
 * Validate that `payload` matches `schema` exactly (whitelist). Returns the
 * parsed, typed value on success; throws {@link PhiEgressError} otherwise. Use
 * at the transmit boundary: `const safe = assertNoPhiEgress(body, AggregateSchema)`.
 */
export function assertNoPhiEgress<T>(payload: unknown, schema: z.ZodType<T>): T {
  const result = schema.safeParse(payload);
  if (result.success) return result.data;

  // Build a value-free description from the issues: path, code, and (for
  // unrecognized_keys) the disallowed KEY names — never the values.
  const issues = result.error.issues.map((issue) => {
    const path = issue.path.join('.') || '(root)';
    if (issue.code === 'unrecognized_keys') {
      return `${path}: unrecognized_keys [${issue.keys.join(', ')}]`;
    }
    return `${path}: ${issue.code}`;
  });
  throw new PhiEgressError('payload failed the no-PHI egress allowlist', issues);
}
