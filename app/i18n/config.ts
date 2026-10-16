/**
 * Locale registry. Adding a language means adding one entry here plus one
 * message catalog — no route or component changes.
 */

export const LOCALES = ["en", "zh", "th"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

type LocaleMeta = {
  /** Value for <html lang> and Intl APIs. */
  readonly tag: string;
  /** Value for hreflang. */
  readonly hreflang: string;
  /** Name in the language itself, for the switcher. */
  readonly nativeName: string;
  readonly dir: "ltr" | "rtl";
};

export const LOCALE_META: Readonly<Record<Locale, LocaleMeta>> = {
  en: { tag: "en", hreflang: "en", nativeName: "English", dir: "ltr" },
  zh: { tag: "zh-Hans", hreflang: "zh-Hans", nativeName: "中文", dir: "ltr" },
  th: { tag: "th", hreflang: "th", nativeName: "ไทย", dir: "ltr" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Picks a locale from the Accept-Language header. Used only to redirect "/" to
 * a real localized URL — every rendered page always has an explicit locale in
 * its path, so crawlers never see two URLs with the same content.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tagRaw = "", ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { tag: tagRaw.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag === "*") break;
    // zh-cn, zh-hans, zh-tw all map to our single Simplified Chinese catalog.
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

/** Absolute URL for a path in a given locale — used by hreflang and sitemap. */
export function localizedUrl(appUrl: string, locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  const base = appUrl.replace(/\/+$/, "");
  return clean ? `${base}/${locale}/${clean}` : `${base}/${locale}`;
}

/** Swaps the locale segment of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = next;
    return `/${segments.join("/")}`;
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}
