# ADR 0001 — Cloudflare Workers with React Router v8

- **Status:** accepted
- **Date:** 2026-09-04
- **Supersedes:** none

## Context

TwoMode must serve three languages of indexable marketing content and an
authenticated app, for roughly ten users at launch, on the smallest possible
monthly bill. A meaningful share of the target audience is in China, where
network reachability differs sharply between providers.

## Decision

Run the whole application as one Cloudflare Worker: React Router v8 in
framework mode for server-rendered pages, with Hono mounted at `/api/v1` for
the JSON API. Store data in D1 and ephemeral state in Workers KV.

## Alternatives considered

**Next.js on Workers via OpenNext.** Adds an adapter layer between the
framework and the runtime. That layer is a source of build-time surprises and
bundle weight, and this project uses none of the Next-specific features that
would justify it.

**Astro for marketing plus a separate React SPA for the app.** The best
possible SEO result, but two deployments, two build pipelines, and an auth
session that has to be shared across them. At ten users that overhead buys
nothing.

**Vercel plus Supabase.** The most comfortable developer experience of the
three, and the option to beat on setup time. Ruled out on reachability from
mainland China, which is a product requirement rather than a preference.

## Consequences

- Local development runs in workerd through `@cloudflare/vite-plugin`, so
  what runs locally is what runs in production.
- Workers enforces a CPU-time limit per request. Waiting on a model provider
  is I/O and does not count against it, but any future CPU-heavy step — large
  diffs, parsing — must move to a Durable Object or a Queue.
- D1 is SQLite. Migrations must follow expand → migrate → contract; a column
  cannot be dropped in the same release that stops using it.
- React Router v8 replaced `AppLoadContext` with typed contexts created by
  `createContext()`. Request-scoped values live in `app/context.ts`.

## Revisit when

Sustained traffic makes a single-region D1 primary the bottleneck, or the
product grows a background-processing need that Workers request handlers
cannot serve.
