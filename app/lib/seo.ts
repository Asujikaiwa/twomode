import type { MetaDescriptor } from "react-router";

import { LOCALES, LOCALE_META, localizedUrl, type Locale } from "~/i18n/config";

type SeoInput = {
  appUrl: string;
  locale: Locale;
  /** Path without the locale segment, e.g. "pricing" or "" for the home page. */
  path?: string;
  title: string;
  description: string;
  /** Public pages are indexable; anything behind auth must pass false. */
  index?: boolean;
  ogImage?: string;
};

/**
 * Builds the full head for a public page: title, description, canonical,
 * hreflang alternates for every locale, Open Graph and Twitter cards.
 *
 * hreflang matters more than usual here — the same page exists in three
 * languages, and without these tags search engines treat them as duplicates
 * and pick one for everybody.
 */
export function seoMeta({
  appUrl,
  locale,
  path = "",
  title,
  description,
  index = true,
  ogImage = "/og/default.png",
}: SeoInput): MetaDescriptor[] {
  const canonical = localizedUrl(appUrl, locale, path);
  const image = ogImage.startsWith("http") ? ogImage : `${appUrl.replace(/\/+$/, "")}${ogImage}`;

  const tags: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "TwoMode" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: image },
    { property: "og:locale", content: LOCALE_META[locale].tag.replace("-", "_") },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  if (!index) {
    tags.push({ name: "robots", content: "noindex, nofollow" });
  }

  for (const alt of LOCALES) {
    tags.push({
      tagName: "link",
      rel: "alternate",
      hreflang: LOCALE_META[alt].hreflang,
      href: localizedUrl(appUrl, alt, path),
    });
  }
  // x-default points at the locale a first-time visitor with no match should get.
  tags.push({
    tagName: "link",
    rel: "alternate",
    hreflang: "x-default",
    href: localizedUrl(appUrl, "en", path),
  });

  return tags;
}

/** Serializable JSON-LD block. Rendered by <JsonLd> with the request nonce. */
export function organizationSchema(appUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TwoMode",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: appUrl,
    description:
      "TwoMode runs a prompt through two AI models: one produces the work, the other reviews it against a locked specification and must supply evidence for every objection.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free — users bring their own model API keys and pay providers directly.",
    },
  };
}

export function faqSchema(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
