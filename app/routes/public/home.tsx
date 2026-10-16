import { Link, useLoaderData, type LoaderFunctionArgs, type MetaArgs } from "react-router";

import { JsonLd } from "~/components/json-ld";
import { cloudflareContext, nonceContext } from "~/context";
import { Button } from "~/components/ui/button";
import { RoleBadge } from "~/components/ui/role-badge";
import { useI18n } from "~/i18n";
import { getMessages } from "~/i18n";
import { DEFAULT_LOCALE, isLocale } from "~/i18n/config";
import { organizationSchema, seoMeta } from "~/lib/seo";

export function loader({ params, context }: LoaderFunctionArgs) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  return {
    locale,
    appUrl: context.get(cloudflareContext).env.APP_URL,
    nonce: context.get(nonceContext),
  };
}

export function meta({ loaderData }: MetaArgs<typeof loader>) {
  if (!loaderData) return [{ title: "TwoMode" }];
  const t = getMessages(loaderData.locale);
  return seoMeta({
    appUrl: loaderData.appUrl,
    locale: loaderData.locale,
    title: `${t.meta.siteName} — ${t.home.headline}`,
    description: t.meta.homeDescription,
  });
}

export default function Home() {
  const { appUrl, nonce } = useLoaderData<typeof loader>();
  const { locale, t, formatNumber } = useI18n();

  return (
    <>
      <JsonLd data={organizationSchema(appUrl)} nonce={nonce} />

      {/* Hero — sized to its content, not to the viewport, so the sections
          below are part of the first frame a visitor and a crawler see. */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 pt-16 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="grid gap-6">
          <p className="font-display text-xs font-semibold tracking-[0.12em] text-maker uppercase">
            {t.home.eyebrow}
          </p>
          <h1 className="font-display text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl">
            {t.home.headline}
          </h1>
          <p className="max-w-[60ch] text-lg text-ink-2">{t.home.sub}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth/register">{t.home.ctaPrimary}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how">{t.home.ctaSecondary}</a>
            </Button>
          </div>
        </div>

        {/* The two roles, side by side — this is the product in one glance. */}
        <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
          <article className="grid gap-2 rounded-xl border border-maker/35 bg-maker-soft p-5">
            <RoleBadge role="maker" label={t.home.makerLabel} className="w-fit" />
            <p className="font-mono text-sm font-medium text-ink">claude-opus-5</p>
            <p className="text-sm text-ink-2">{t.home.makerRole}</p>
          </article>
          <article className="grid gap-2 rounded-xl border border-checker/35 bg-checker-soft p-5">
            <RoleBadge role="checker" label={t.home.checkerLabel} className="w-fit" />
            <p className="font-mono text-sm font-medium text-ink">gemini-3.1-pro</p>
            <p className="text-sm text-ink-2">{t.home.checkerRole}</p>
          </article>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-12">
        <h2 className="font-display mb-8 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {t.home.howTitle}
        </h2>
        {/* Numbered because the four mechanisms genuinely run in this order —
            lock the spec, demand evidence, close settled issues, then stop. */}
        <ol className="grid gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle sm:grid-cols-2">
          {t.home.how.map((item, i) => (
            <li key={item.title} className="grid content-start gap-2 bg-surface p-6">
              <span className="font-mono text-xs font-medium text-maker">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold text-balance">{item.title}</h3>
              <p className="text-sm text-ink-2">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-6 rounded-xl border border-border-subtle bg-surface p-8 sm:grid-cols-[1.4fr_1fr] sm:items-center">
          <div className="grid gap-3">
            <h2 className="font-display text-2xl font-bold tracking-tight text-balance">
              {t.home.tokensTitle}
            </h2>
            <p className="max-w-[62ch] text-ink-2">{t.home.tokensBody}</p>
          </div>
          <div className="grid justify-items-start gap-1 border-t border-border-subtle pt-5 sm:justify-items-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
            {/* An illustrative figure from a reference run, not a promise —
                the real number for each account is in its usage dashboard. */}
            <p className="font-display text-4xl font-bold tracking-tight tabular-nums">
              {formatNumber(18400)}
            </p>
            <p className="text-sm font-medium text-ink-2">{t.home.tokensStat}</p>
            <p className="text-xs text-muted">{t.home.tokensStatNote}</p>
            <Link
              to={`/${locale}/pricing`}
              className="mt-2 text-sm font-semibold text-maker hover:underline"
            >
              {t.pricing.title} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
