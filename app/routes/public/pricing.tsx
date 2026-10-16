import { Link, type LoaderFunctionArgs, type MetaArgs } from "react-router";

import { Button } from "~/components/ui/button";
import { cloudflareContext } from "~/context";
import { getMessages, useI18n } from "~/i18n";
import { DEFAULT_LOCALE, isLocale } from "~/i18n/config";
import { seoMeta } from "~/lib/seo";

export function loader({ params, context }: LoaderFunctionArgs) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  return { locale, appUrl: context.get(cloudflareContext).env.APP_URL };
}

export function meta({ loaderData }: MetaArgs<typeof loader>) {
  if (!loaderData) return [{ title: "Pricing — TwoMode" }];
  const t = getMessages(loaderData.locale);
  return seoMeta({
    appUrl: loaderData.appUrl,
    locale: loaderData.locale,
    path: "pricing",
    title: `${t.pricing.title} — ${t.meta.siteName}`,
    description: t.pricing.lede,
  });
}

export default function Pricing() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {t.pricing.title}
      </h1>
      <p className="mt-4 max-w-[60ch] text-lg text-ink-2">{t.pricing.lede}</p>

      <article className="mt-10 grid gap-6 rounded-xl border border-maker/35 bg-surface p-8">
        <div className="grid gap-1">
          <p className="font-display text-xs font-semibold tracking-[0.12em] text-maker uppercase">
            {t.pricing.planName}
          </p>
          <p className="font-display text-4xl font-bold tracking-tight">{t.pricing.price}</p>
          <p className="text-sm text-muted">{t.pricing.priceNote}</p>
        </div>

        <ul className="grid gap-2">
          {t.pricing.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-ink-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="mt-1.5 size-3.5 shrink-0 fill-none stroke-ok"
                strokeWidth="2"
              >
                <path d="m3 8.5 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button asChild size="lg" className="w-fit">
          <Link to="/auth/register">{t.pricing.cta}</Link>
        </Button>
      </article>

      <section className="mt-10 border-l-2 border-maker pl-5">
        <h2 className="font-semibold">{t.pricing.honestyTitle}</h2>
        <p className="mt-1 max-w-[62ch] text-ink-2">{t.pricing.honestyBody}</p>
      </section>
    </section>
  );
}
