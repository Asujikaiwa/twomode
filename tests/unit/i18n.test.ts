import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  isLocale,
  localizedUrl,
  negotiateLocale,
  switchLocalePath,
} from "../../app/i18n/config";
import { getMessages } from "../../app/i18n";
import { en } from "../../app/i18n/messages/en";
import { th } from "../../app/i18n/messages/th";
import { zh } from "../../app/i18n/messages/zh";

describe("isLocale", () => {
  it("accepts supported locales only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("th")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe("negotiateLocale", () => {
  it("falls back to the default when the header is missing", () => {
    expect(negotiateLocale(null)).toBe(DEFAULT_LOCALE);
    expect(negotiateLocale("")).toBe(DEFAULT_LOCALE);
  });

  it("honours quality values rather than header order", () => {
    expect(negotiateLocale("th;q=0.4,zh;q=0.9")).toBe("zh");
  });

  it("maps regional Chinese tags onto the single zh catalog", () => {
    expect(negotiateLocale("zh-CN,en;q=0.5")).toBe("zh");
    expect(negotiateLocale("zh-Hant-TW")).toBe("zh");
  });

  it("skips unsupported languages instead of failing", () => {
    expect(negotiateLocale("de-DE,fr;q=0.8,th;q=0.2")).toBe("th");
    expect(negotiateLocale("de-DE,fr;q=0.8")).toBe(DEFAULT_LOCALE);
  });

  it("does not treat the wildcard as a language", () => {
    expect(negotiateLocale("*")).toBe(DEFAULT_LOCALE);
  });
});

describe("switchLocalePath", () => {
  it("replaces an existing locale segment and keeps the rest of the route", () => {
    expect(switchLocalePath("/en/pricing", "th")).toBe("/th/pricing");
    expect(switchLocalePath("/zh/docs/keys", "en")).toBe("/en/docs/keys");
  });

  it("prefixes a path that has no locale yet", () => {
    expect(switchLocalePath("/", "zh")).toBe("/zh");
    expect(switchLocalePath("/pricing", "zh")).toBe("/zh/pricing");
  });
});

describe("localizedUrl", () => {
  it("builds absolute URLs without double slashes", () => {
    expect(localizedUrl("https://twomode.app/", "en")).toBe("https://twomode.app/en");
    expect(localizedUrl("https://twomode.app", "th", "/pricing")).toBe(
      "https://twomode.app/th/pricing",
    );
  });
});

describe("message catalogs", () => {
  const catalogs = { en, zh, th };

  it("exposes the same key structure in every language", () => {
    // A missing translation must fail here, not silently render blank in
    // production for whichever language nobody on the team reads.
    const shape = (value: unknown): unknown => {
      if (Array.isArray(value)) return value.map(shape);
      if (value && typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value as Record<string, unknown>)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, val]) => [key, shape(val)]),
        );
      }
      return typeof value;
    };

    expect(shape(catalogs.zh)).toEqual(shape(catalogs.en));
    expect(shape(catalogs.th)).toEqual(shape(catalogs.en));
  });

  it("has no empty strings", () => {
    const walk = (value: unknown, path: string): void => {
      if (typeof value === "string") {
        expect(value.trim(), `empty message at ${path}`).not.toBe("");
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item, i) => walk(item, `${path}[${i}]`));
        return;
      }
      if (value && typeof value === "object") {
        for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
          walk(val, `${path}.${key}`);
        }
      }
    };

    for (const [locale, catalog] of Object.entries(catalogs)) {
      walk(catalog, locale);
    }
  });

  it("returns a real catalog for every supported locale", () => {
    expect(getMessages("th").nav.pricing).toBe(th.nav.pricing);
    expect(getMessages("zh").nav.pricing).toBe(zh.nav.pricing);
  });
});
