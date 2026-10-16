/**
 * The English catalog is the source of truth: its shape defines the Messages
 * type, so a missing key in another language is a compile error, not a
 * blank string discovered by a user.
 */
export const en = {
  meta: {
    siteName: "TwoMode",
    tagline: "One model writes. Another one checks. You get the answer that survived both.",
    homeDescription:
      "TwoMode runs your prompt through two AI models — one produces the work, the other reviews it against a locked spec and must prove every objection. Bring your own API keys; we never charge a markup on your tokens.",
  },
  nav: {
    product: "Product",
    pricing: "Pricing",
    docs: "Docs",
    faq: "FAQ",
    signIn: "Sign in",
    getStarted: "Get started",
    skipToContent: "Skip to content",
    changeLanguage: "Change language",
    changeTheme: "Change theme",
  },
  home: {
    eyebrow: "Bring your own key · no token markup",
    headline: "Two models. One answer that held up.",
    sub: "Pick which model does the work and which one reviews it. The reviewer cannot block your work on a hunch — every objection has to come with evidence that runs.",
    ctaPrimary: "Start free",
    ctaSecondary: "How it works",
    makerLabel: "Maker",
    checkerLabel: "Checker",
    makerRole: "Produces the work and answers objections",
    checkerRole: "Reviews against the locked spec, with proof",
    howTitle: "Why two models beat one",
    how: [
      {
        title: "The spec is locked before any work starts",
        body: "The reviewer writes the final acceptance contract, so it is bound by its own criteria and cannot move the goalposts three rounds later.",
      },
      {
        title: "No evidence, no blocking",
        body: "A blocking objection must ship a check that actually fails. If the reviewer cannot produce one, the objection is downgraded automatically and the work moves on.",
      },
      {
        title: "Settled questions stay settled",
        body: "Every issue is fingerprinted. Once it is fixed or dismissed, it cannot be raised again in different words — which is what stops the loop from running forever.",
      },
      {
        title: "It always stops",
        body: "Zero open blockers means accepted. No progress for two rounds running means deadlock, handed back to you with the open questions named.",
      },
    ],
    tokensTitle: "Built to spend the fewest tokens possible",
    tokensBody:
      "Running two models naively costs two to four times a single chat. Prompt caching, diff-only review, structured verdicts and a compact issue ledger bring that back down — and the app shows you the number for every answer, because it is your bill, not ours.",
    tokensStat: "tokens per accepted answer",
    tokensStatNote: "shown live in your usage dashboard",
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Does the reviewing model ever see my API key for the other provider?",
        a: "No. Each provider is called separately with only its own key, from the server, over TLS. A key is never included in a prompt, never sent to another provider, and never returned to the browser after you save it.",
      },
      {
        q: "How are my API keys stored?",
        a: "Encrypted with AES-256-GCM before they touch the database. The master key lives in a Workers secret, never in the repository. After saving, only the last four characters are ever displayed, and you can revoke a key at any time with immediate effect.",
      },
      {
        q: "What does TwoMode cost?",
        a: "The app is free and you pay your model providers directly. We add no markup to your tokens, which is also why we never need to see your usage in order to bill you.",
      },
      {
        q: "Which models can I use?",
        a: "Any Claude model through your Anthropic key and any Gemini model through your Google key. You choose which one produces the work and which one reviews it, and you can swap the two roles in one click.",
      },
      {
        q: "What happens if the reviewing model is down?",
        a: "You still get the work, labelled as unreviewed, instead of an error page. Failed calls are retried with exponential backoff only when the provider says the failure is retryable.",
      },
      {
        q: "Can I delete my data?",
        a: "Yes. You can export everything as JSON and delete your account from settings; deletion completes within 30 days including backup rotation. Conversation content is deleted automatically after 180 days by default.",
      },
    ],
  },
  pricing: {
    title: "Pricing",
    lede: "One plan. It is free, because you bring your own API keys and pay the model providers directly.",
    planName: "Bring your own key",
    price: "Free",
    priceNote: "plus whatever your providers charge you",
    features: [
      "Unlimited conversations",
      "Any Claude and Gemini model your keys can reach",
      "Swap which model makes and which one checks",
      "Token usage and savings dashboard",
      "Export and delete your data at any time",
    ],
    cta: "Create an account",
    honestyTitle: "Why free, honestly",
    honestyBody:
      "Because we never touch your tokens, running this costs us a few dollars a month regardless of how much you use it. If that ever changes we will say so before it does, not after.",
  },
  footer: {
    product: "Product",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    rights: "All rights reserved.",
    builtWith: "Runs on Cloudflare Workers.",
  },
  errors: {
    notFoundTitle: "That page does not exist",
    notFoundBody: "The link may be outdated, or the address may have a typo in it.",
    genericTitle: "Something broke on our side",
    genericBody: "The error has been recorded. Reloading usually works; if it does not, the reference below helps us find it.",
    backHome: "Back to the homepage",
    reference: "Reference",
  },
};

// No `as const` on purpose: the type must describe the SHAPE (string, array of
// {q,a}), not the exact English wording, or every translation would be a type
// error for saying something different.
export type Messages = typeof en;
