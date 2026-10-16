import { useLocation, useNavigate } from "react-router";

import { useI18n } from "~/i18n";
import { LOCALES, LOCALE_META, switchLocalePath } from "~/i18n/config";

/**
 * A plain <select> rather than a custom dropdown: it is keyboard accessible,
 * screen-reader correct and uses the native picker on mobile for free.
 * Navigation is a real URL change, so the choice is shareable and indexable.
 */
export function LocaleSwitcher() {
  const { locale, t } = useI18n();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t.nav.changeLanguage}</span>
      <select
        value={locale}
        onChange={(event) => {
          const next = event.target.value as (typeof LOCALES)[number];
          navigate(switchLocalePath(pathname, next));
        }}
        className="tap-target cursor-pointer appearance-none rounded-lg border border-border-subtle bg-ground py-2 pr-8 pl-3 text-sm text-ink-2 hover:border-maker"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_META[code].nativeName}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-3 size-3 fill-none stroke-current text-muted"
        strokeWidth="1.5"
      >
        <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
