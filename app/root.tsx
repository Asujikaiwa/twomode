import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useRouteLoaderData,
  type LoaderFunctionArgs,
} from "react-router";

import { cloudflareContext, nonceContext } from "./context";
import stylesheet from "./app.css?url";
import { DEFAULT_LOCALE, LOCALE_META, isLocale, type Locale } from "./i18n/config";
import { getMessages } from "./i18n";

export function loader({ context }: LoaderFunctionArgs) {
  const { env } = context.get(cloudflareContext);
  return {
    nonce: context.get(nonceContext),
    appUrl: env.APP_URL,
    environment: env.ENVIRONMENT,
  };
}

export type RootLoaderData = Awaited<ReturnType<typeof loader>>;

/**
 * Applies the stored theme before first paint. Without this the page flashes
 * light, then repaints dark — which is both ugly and a CLS risk.
 */
const THEME_BOOTSTRAP = `
(function(){try{
  var t = localStorage.getItem('tm-theme');
  if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
}catch(e){}})();
`;

/** Reads the locale from the URL — the only place it is ever stored. */
function useLocaleFromPath(): Locale {
  const { pathname } = useLocation();
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<RootLoaderData>("root");
  const nonce = data?.nonce ?? "";
  const locale = useLocaleFromPath();
  const meta = LOCALE_META[locale];

  return (
    <html lang={meta.tag} dir={meta.dir} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1b62e0" />

        {/* Preconnect before the stylesheet request so font files start
            downloading a full round trip earlier — measurable on LCP. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
        />
        <link rel="stylesheet" href={stylesheet} />

        <Meta />
        <Links />
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-screen bg-ground text-ink antialiased">
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const locale = useLocaleFromPath();
  const t = getMessages(locale).errors;

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const title = isNotFound ? t.notFoundTitle : t.genericTitle;
  const body = isNotFound ? t.notFoundBody : t.genericBody;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6">
      <p className="font-display text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        {isRouteErrorResponse(error) ? error.status : 500}
      </p>
      <h1 className="font-display text-3xl font-bold tracking-tight text-balance">{title}</h1>
      <p className="text-ink-2">{body}</p>
      <a
        href={`/${locale}`}
        className="tap-target inline-flex w-fit items-center rounded-lg bg-maker px-5 text-sm font-semibold text-white"
      >
        {t.backHome}
      </a>
      {import.meta.env.DEV && error instanceof Error ? (
        <pre className="overflow-x-auto rounded-lg border border-border-subtle bg-surface p-4 font-mono text-xs text-ink-2">
          {error.stack}
        </pre>
      ) : null}
    </main>
  );
}
