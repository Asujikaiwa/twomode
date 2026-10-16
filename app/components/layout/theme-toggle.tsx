import { useEffect, useState } from "react";

import { useT } from "~/i18n";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "tm-theme";

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  try {
    if (theme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice just does not persist.
  }
}

export function ThemeToggle() {
  const t = useT();
  // Starts at "system" on the server and on first paint; the inline bootstrap
  // script in root.tsx has already applied the stored value to <html>, so
  // there is no flash — this state only drives the control itself.
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") setTheme(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={t.nav.changeTheme}
      title={t.nav.changeTheme}
      onClick={() => {
        setTheme(next);
        apply(next);
      }}
      className="tap-target inline-flex items-center justify-center rounded-lg border border-border-subtle px-3 text-ink-2 hover:border-maker hover:text-ink"
    >
      <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-current" strokeWidth="1.6">
        <circle cx="10" cy="10" r="3.6" />
        <path
          d="M10 2.4v1.6M10 16v1.6M17.6 10H16M4 10H2.4M15.4 4.6l-1.1 1.1M5.7 14.3l-1.1 1.1M15.4 15.4l-1.1-1.1M5.7 5.7 4.6 4.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
