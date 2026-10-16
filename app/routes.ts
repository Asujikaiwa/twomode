import { index, route, type RouteConfig } from "@react-router/dev/routes";

/**
 * Every human-facing page lives under an explicit /:locale segment. "/" only
 * ever redirects, so the same content is never reachable at two URLs — which
 * is what keeps hreflang honest and avoids duplicate-content dilution.
 */
export default [
  index("routes/locale-redirect.tsx"),

  // Crawler-facing resources are locale-independent.
  route("robots.txt", "routes/resources/robots.ts"),
  route("sitemap.xml", "routes/resources/sitemap.ts"),
  route("llms.txt", "routes/resources/llms.ts"),

  route(":locale", "routes/public/layout.tsx", [
    index("routes/public/home.tsx"),
    route("pricing", "routes/public/pricing.tsx"),
    route("faq", "routes/public/faq.tsx"),
  ]),
] satisfies RouteConfig;
