import { Link } from "react-router";

import { useI18n } from "~/i18n";

export function SiteFooter() {
  const { locale, t, formatDate } = useI18n();
  const base = `/${locale}`;

  return (
    <footer className="mt-24 border-t border-border-subtle bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div className="grid gap-2">
          <p className="font-display text-lg font-bold tracking-tight">
            <span className="text-maker">Two</span>
            <span className="text-checker">Mode</span>
          </p>
          <p className="max-w-xs text-sm text-muted">{t.meta.tagline}</p>
        </div>

        <nav aria-label={t.footer.product} className="grid content-start gap-2 text-sm">
          <p className="font-display text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">
            {t.footer.product}
          </p>
          <Link to={`${base}/pricing`} className="w-fit text-ink-2 hover:text-maker">
            {t.nav.pricing}
          </Link>
          <Link to={`${base}/faq`} className="w-fit text-ink-2 hover:text-maker">
            {t.nav.faq}
          </Link>
        </nav>

        <nav aria-label={t.footer.legal} className="grid content-start gap-2 text-sm">
          <p className="font-display text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">
            {t.footer.legal}
          </p>
          <Link to={`${base}/legal/privacy`} className="w-fit text-ink-2 hover:text-maker">
            {t.footer.privacy}
          </Link>
          <Link to={`${base}/legal/terms`} className="w-fit text-ink-2 hover:text-maker">
            {t.footer.terms}
          </Link>
          <Link to={`${base}/legal/cookies`} className="w-fit text-ink-2 hover:text-maker">
            {t.footer.cookies}
          </Link>
        </nav>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap gap-x-4 gap-y-1 border-t border-border-subtle px-6 py-5 text-xs text-muted">
        <span>
          © {formatDate(new Date(), { year: "numeric" })} TwoMode. {t.footer.rights}
        </span>
        <span className="ml-auto">{t.footer.builtWith}</span>
      </div>
    </footer>
  );
}
