import { createContext } from "react-router";

/**
 * React Router v8 replaced the single `AppLoadContext` object with typed
 * contexts. Each value gets its own context, so a loader that only needs the
 * nonce cannot accidentally reach the whole Cloudflare environment.
 *
 * Values are populated once per request in workers/app.ts.
 */

export type CloudflareContextValue = {
  env: Env;
  ctx: ExecutionContext;
};

export const cloudflareContext = createContext<CloudflareContextValue>();

/** Per-request CSP nonce. Every inline <script> must carry it or be dropped. */
export const nonceContext = createContext<string>("");
