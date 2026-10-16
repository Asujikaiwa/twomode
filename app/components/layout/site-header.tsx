import { Link, NavLink } from "react-router";

import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "~/components/ui/button";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/cn";

export function SiteHeader() {
  const { locale, t } = useI18n();
  const base = `/${locale}`;

  const links = [
    { to: `${base}/pricing`, label: t.nav.pricing },
    { to: `${base}/faq`, label: t.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-ground/85 backdrop-blur-sm">
      {/* First tab stop on every page — required for keyboard users who would
          otherwise tab through the whole nav on each navigation. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-maker focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t.nav.skipToContent}
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
        <Link to={base} className="font-display text-xl font-bold tracking-tight">
          <span className="text-maker">Two</span>
          <span className="text-checker">Mode</span>
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "tap-target inline-flex items-center rounded-lg px-3 text-sm font-medium",
                  isActive ? "bg-surface text-ink" : "text-ink-2 hover:bg-surface hover:text-ink",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth/login">{t.nav.signIn}</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/auth/register">{t.nav.getStarted}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
