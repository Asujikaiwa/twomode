import { createContext, useContext, useMemo, type ReactNode } from "react";

import { DEFAULT_LOCALE, LOCALE_META, type Locale } from "./config";
import { en, type Messages } from "./messages/en";
import { th } from "./messages/th";
import { zh } from "./messages/zh";

/**
 * All three catalogs are bundled. They total a few kilobytes gzipped, which is
 * far cheaper than the extra round trip a per-locale fetch would cost on LCP.
 */
const CATALOGS: Record<Locale, Messages> = { en, zh, th };

export function getMessages(locale: Locale): Messages {
  return CATALOGS[locale] ?? CATALOGS[DEFAULT_LOCALE];
}

type I18nValue = {
  locale: Locale;
  t: Messages;
  /** Locale-aware number formatting — never hand-roll thousands separators. */
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<I18nValue>(() => {
    const tag = LOCALE_META[locale].tag;
    const number = new Intl.NumberFormat(tag);
    const date = new Intl.DateTimeFormat(tag, { dateStyle: "medium" });

    return {
      locale,
      t: getMessages(locale),
      formatNumber: (v, options) =>
        options ? new Intl.NumberFormat(tag, options).format(v) : number.format(v),
      formatDate: (v, options) =>
        options ? new Intl.DateTimeFormat(tag, options).format(v) : date.format(v),
      formatCurrency: (v, currency = "USD") =>
        new Intl.NumberFormat(tag, { style: "currency", currency }).format(v),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return ctx;
}

/** Shorthand for the common case of only needing the message catalog. */
export function useT(): Messages {
  return useI18n().t;
}

export type { Messages };
