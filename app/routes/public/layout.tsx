import { Outlet, data, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { SiteFooter } from "~/components/layout/site-footer";
import { SiteHeader } from "~/components/layout/site-header";
import { cloudflareContext, nonceContext } from "~/context";
import { I18nProvider } from "~/i18n";
import { isLocale } from "~/i18n/config";

/**
 * Guards the :locale segment. An unknown language must 404 rather than fall
 * back to English, or every typo becomes an indexable thin duplicate page.
 */
export function loader({ params, context }: LoaderFunctionArgs) {
  const locale = params.locale;
  if (!isLocale(locale)) {
    throw data("Unknown locale", { status: 404 });
  }

  return {
    locale,
    appUrl: context.get(cloudflareContext).env.APP_URL,
    nonce: context.get(nonceContext),
  };
}

export type PublicLayoutData = Awaited<ReturnType<typeof loader>>;

export default function PublicLayout() {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <I18nProvider locale={locale}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </I18nProvider>
  );
}
