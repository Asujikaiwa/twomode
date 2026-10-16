# TwoMode

One model writes, another checks, and the loop stops when the work has no
open objections left. Users bring their own provider API keys, so running the
service costs a few dollars a month regardless of how heavily it is used.

**Phase 2, part 1 of the build.** This slice contains the project skeleton,
the design system, the three-language routing, the Worker entry with security
headers, the versioned API shell, and the public pages. Auth, key management
and the orchestrator are the next parts.

---

## Requirements

- Node 22.22.2 or newer
- A Cloudflare account (free plan is enough to run everything here)

## Getting started

```bash
npm ci --legacy-peer-deps      # see "About the install flag" below
cp .env.example .dev.vars      # then fill in the two generated secrets
npm run dev                    # http://localhost:5173
```

`npm run dev` runs the app inside workerd through the Cloudflare Vite plugin,
so local behaviour matches production instead of matching Node.

### About the install flag

`npm install` without `--legacy-peer-deps` crashes on npm 10.9.7 with
`Cannot read properties of null (reading 'edgesOut')` while resolving this
tree — `better-auth` declares an optional peer on an older `vitest` major.
The flag is pinned in CI too so the two can never drift. Switching to pnpm
also resolves it if you prefer.

### Cloudflare resources

The IDs in `wrangler.jsonc` are placeholders. Create the real ones once:

```bash
npx wrangler d1 create twomode-db
npx wrangler kv namespace create KV
```

then paste the printed IDs into `wrangler.jsonc`, and set the secrets:

```bash
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put KEY_ENCRYPTION_KEY
```

### Local helper containers

Optional, and only for things wrangler cannot emulate:

```bash
docker compose up -d              # mailpit — catches all outgoing email
docker compose --profile tools up # adds a read-only SQLite browser
```

---

## How to verify this slice actually works

Every command below was run against this code before it was handed over; the
expected result is what it printed.

| Command | Expected |
| --- | --- |
| `npm run test` | `Test Files 2 passed (2)`, `Tests 20 passed (20)` |
| `npm run typecheck` | no output, exit 0 |
| `npm run build` | client and server bundles written to `build/`, client entry ≈ 186 kB (58 kB gzipped) |

With `npm run dev` running on port 5173:

| Request | Expected |
| --- | --- |
| `curl -sI -H 'Accept-Language: th' localhost:5173/` | `302` to `/th` — locale negotiated, not guessed |
| `curl -s localhost:5173/zh \| grep '<h1'` | the headline in Simplified Chinese |
| `curl -s localhost:5173/de -o /dev/null -w '%{http_code}'` | `404` — unknown locales must not fall back |
| `curl -sD- localhost:5173/en -o /dev/null \| grep -i content-security` | CSP with a fresh `nonce-…` and no `unsafe-inline` for scripts |
| `curl -s localhost:5173/en \| grep alternate` | three `hreflang` links plus `x-default` |
| `curl -s localhost:5173/en/faq \| grep -c ld+json` | `1` — FAQPage structured data |
| `curl -s localhost:5173/sitemap.xml \| grep -c '<loc>'` | `9` — three pages × three languages |
| `curl -s localhost:5173/api/v1/health` | `{"status":"ok",…}` with a `requestId` |
| `curl -s localhost:5173/robots.txt` | `Disallow: /` outside production — staging must never be indexed |

---

## Layout

```
app/
  context.ts          request-scoped values (Cloudflare env, CSP nonce)
  root.tsx            html shell, theme bootstrap, fonts, error boundary
  routes.ts           route table — every page lives under /:locale
  app.css             design tokens and the Tailwind theme
  i18n/               locale registry, catalogs, Intl formatters
  components/         layout, ui primitives, structured data
  routes/
    public/           landing, pricing, faq
    resources/        robots.txt, sitemap.xml, llms.txt
server/
  api/v1/             Hono app: request ids, error contract, health
  http/               error contract, security headers, redacting logger
workers/app.ts        Worker entry — splits API from pages, applies headers
tests/unit/           i18n and http contract tests
docs/adr/             architecture decisions and the reasoning behind them
```

## Conventions

- **TypeScript strict**, plus `noUncheckedIndexedAccess`. TypeScript 7 removed
  `baseUrl`, so path aliases in `tsconfig.json` are relative to that file.
- **Colour never carries meaning alone.** Maker and Checker always render a
  text label next to their colour.
- **Every interactive target is at least 44 px** via the `tap-target` class.
- **Themes are token-only.** Never define a colour inside a `@media` or
  `[data-theme]` block that does not also exist in `:root`.
- **Nothing key-shaped is ever logged.** `server/http/logger.ts` redacts on the
  way out; do not bypass it with a bare `console.log`.

## What is deliberately not here yet

Auth, key storage, the orchestrator, the chat UI, D1 schema and migrations,
E2E tests, and the Lighthouse budget job. They are the next parts of phase 2,
in that order — auth and key storage first, because that is the riskiest code
in the product and it is cheapest to get right while nothing depends on it.

## Decisions worth reading before changing things

- [ADR 0001 — Cloudflare Workers with React Router v8](docs/adr/0001-cloudflare-workers-react-router.md)
- [ADR 0002 — Bring-your-own-key, stored with envelope encryption](docs/adr/0002-byok-key-storage.md)
