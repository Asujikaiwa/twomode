/**
 * Hand-maintained until the first `npm run typegen`, which regenerates this
 * file from wrangler.jsonc. Keep the two in sync when you add a binding.
 */
declare global {
  interface Env {
    /** Static assets served by the Workers assets binding. */
    ASSETS: Fetcher;

    /** Primary datastore. */
    DB: D1Database;

    /** Sessions, rate-limit counters, idempotency records, dedupe cache. */
    KV: KVNamespace;

    /** Public base URL, e.g. https://twomode.app — used for canonical/hreflang. */
    APP_URL: string;
    ENVIRONMENT: "development" | "staging" | "production";

    /* --- secrets: set with `wrangler secret put <NAME>`, never in config --- */
    BETTER_AUTH_SECRET?: string;
    /** Master key that wraps each user's provider API key. */
    KEY_ENCRYPTION_KEY?: string;
    RESEND_API_KEY?: string;
  }
}

export {};
