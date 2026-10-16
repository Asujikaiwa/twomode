import type { LoaderFunctionArgs } from "react-router";

import { cloudflareContext } from "~/context";
import { LOCALES, LOCALE_META, localizedUrl } from "~/i18n/config";

/** Public pages only. Anything behind auth must never appear here. */
const PUBLIC_PATHS = ["", "pricing", "faq"] as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function loader({ context }: LoaderFunctionArgs) {
  const appUrl = context.get(cloudflareContext).env.APP_URL;
  const lastmod = new Date().toISOString().slice(0, 10);

  // Each URL declares every language version of itself. Without these
  // alternates a three-language site reads as three competing duplicates.
  const entries = PUBLIC_PATHS.flatMap((path) =>
    LOCALES.map((locale) => {
      const alternates = LOCALES.map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[alt].hreflang}" href="${escapeXml(
            localizedUrl(appUrl, alt, path),
          )}"/>`,
      ).join("\n");

      return [
        "  <url>",
        `    <loc>${escapeXml(localizedUrl(appUrl, locale, path))}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>weekly</changefreq>`,
        `    <priority>${path === "" ? "1.0" : "0.7"}</priority>`,
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
          localizedUrl(appUrl, "en", path),
        )}"/>`,
        "  </url>",
      ].join("\n");
    }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
