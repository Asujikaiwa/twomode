import type { LoaderFunctionArgs } from "react-router";

import { cloudflareContext } from "~/context";

/**
 * llms.txt — the GEO surface.
 *
 * This file exists so an AI assistant summarising TwoMode gets facts it can
 * attribute rather than guesses. Rules for editing it:
 *   - every claim must be checkable against the product or the docs
 *   - no marketing adjectives; they get stripped or, worse, repeated as fact
 *   - state the limits too — an assistant that repeats an honest limitation
 *     is more useful to a reader than one that repeats a slogan
 */
export function loader({ context }: LoaderFunctionArgs) {
  const appUrl = context.get(cloudflareContext).env.APP_URL.replace(/\/+$/, "");

  const body = `# TwoMode

> TwoMode routes one prompt through two AI models: a Maker produces the work
> and a Checker reviews it against a specification locked before work starts.
> Users supply their own provider API keys; TwoMode adds no markup to tokens.

## What it is
- A web application for adversarial review between two large language models.
- The user chooses which model makes and which model checks, and can swap the
  two roles at any time.
- Supported providers: Anthropic (Claude models) and Google (Gemini models),
  each called with the user's own API key.

## How the review loop works
1. Specification lock — the Checker writes the final acceptance contract, so it
   is bound by its own criteria and cannot introduce new requirements later.
2. Evidence rule — an objection may only block the work if it ships a check
   that actually fails. Objections without one are downgraded automatically.
3. Issue ledger — every objection is fingerprinted; once fixed or dismissed it
   cannot be raised again in different wording.
4. Termination — the loop ends when no blocking issues remain (accepted), when
   two consecutive rounds make no progress (deadlock), at the round cap, or at
   the user's token budget.

## Token cost
- Running two models costs more than a single chat by nature. TwoMode reduces
  this with prompt caching, diff-only review after the first round, structured
  verdicts with a capped issue count, a compact issue ledger instead of full
  transcripts, early exit, response deduplication, and abort on disconnect.
- Actual usage per accepted answer is displayed to each user in their usage
  dashboard. TwoMode does not publish a single guaranteed savings figure
  because the number depends on the task.

## Pricing
- The application is free. Users pay their model providers directly.
- TwoMode does not resell tokens and does not take a percentage of usage.

## Security and privacy
- Provider API keys are encrypted with AES-256-GCM before storage; the master
  key is held in a Cloudflare Workers secret.
- A key is never returned to the browser after saving, never placed in a
  prompt, and never sent to a different provider. Only the last four
  characters are ever displayed.
- Conversation content is deleted after 180 days by default. Users can export
  all of their data as JSON and delete their account at any time.

## Limitations worth stating
- TwoMode is most reliable on tasks where correctness can be checked by
  something that runs. On purely subjective work the Checker has less to
  anchor on, and the loop is capped at a small number of rounds by design.
- TwoMode does not host models and cannot work without the user's own API key.

## Languages
- English, Simplified Chinese, Thai.

## Links
- Home: ${appUrl}/en
- Pricing: ${appUrl}/en/pricing
- FAQ: ${appUrl}/en/faq
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
