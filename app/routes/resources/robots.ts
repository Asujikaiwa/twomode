import type { LoaderFunctionArgs } from "react-router";

import { cloudflareContext } from "~/context";

export function loader({ context }: LoaderFunctionArgs) {
  const { APP_URL, ENVIRONMENT } = context.get(cloudflareContext).env;

  // Staging must never be indexed — a staging copy outranking production is a
  // self-inflicted wound that takes weeks to undo.
  const body =
    ENVIRONMENT === "production"
      ? [
          "User-agent: *",
          "Allow: /",
          "Disallow: /app/",
          "Disallow: /auth/",
          "Disallow: /api/",
          "",
          `Sitemap: ${APP_URL.replace(/\/+$/, "")}/sitemap.xml`,
          "",
        ].join("\n")
      : ["User-agent: *", "Disallow: /", ""].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
