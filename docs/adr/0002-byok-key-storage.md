# ADR 0002 — Bring-your-own-key, stored with envelope encryption

- **Status:** accepted, with a named risk
- **Date:** 2026-09-04

## Context

TwoMode calls two model providers on the user's behalf. Someone has to pay for
those tokens, and holding other people's API keys is the heaviest liability in
the system: one leak is unrecoverable for every affected user.

## Decision

Users supply their own provider API keys. Each key is encrypted with
AES-256-GCM via the Web Crypto API before it reaches D1. The master key lives
in a Workers secret and never appears in the repository.

Rules that follow from this and are not negotiable:

1. A key is never returned to the browser after it is saved. The settings page
   shows the last four characters and nothing else.
2. A key is never placed inside a prompt and never sent to a provider other
   than its own.
3. A redaction step strips key-shaped strings from every log line before it is
   written, as a last line of defence rather than a first one.
4. Each stored key records a `keyVersion`, so the master key can be rotated by
   re-wrapping rows without asking users to re-enter anything.
5. Saving a key validates it with a minimal call, and the endpoint is rate
   limited per user per day so TwoMode cannot be used to test stolen keys.

## The risk we are accepting

Server-side storage means a compromise of both the database and the master key
exposes user keys. The alternative — keeping keys in the browser only — removes
that risk entirely but forces users to re-enter a key on every device and
browser, and rules out any future server-side background work.

We chose storage for the product it lets us build, not because the risk is
small. If the user base becomes one where this trade is wrong, browser-only
mode is the fallback and it is a settings toggle, not a rewrite.

## Consequences

- Revocation must take effect immediately, so a revoked key cannot be served
  from any cache.
- Billing, quotas and token metering are not needed at all, which removes a
  large amount of product surface from the first release.
- Monthly infrastructure cost does not scale with usage, because the expensive
  resource is never ours.
