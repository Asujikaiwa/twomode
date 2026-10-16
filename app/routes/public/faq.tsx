import { useLoaderData, type LoaderFunctionArgs, type MetaArgs } from "react-router";

import { JsonLd } from "~/components/json-ld";
import { cloudflareContext, nonceContext } from "~/context";
import { getMessages, useT } from "~/i18n";
import { DEFAULT_LOCALE, isLocale } from "~/i18n/config";
import { faqSchema, seoMeta } from "~/lib/seo";

export function loader({ params, context }: LoaderFunctionArgs) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  return {
    locale,
    appUrl: context.get(cloudflareContext).env.APP_URL,
    nonce: context.get(nonceContext),
    items: getMessages(locale).faq.items,
  };
}

export function meta({ loaderData }: MetaArgs<typeof loader>) {
  if (!loaderData) return [{ title: "FAQ — TwoMode" }];
  const t = getMessages(loaderData.locale);
  return seoMeta({
    appUrl: loaderData.appUrl,
    locale: loaderData.locale,
    path: "faq",
    title: `${t.faq.title} — ${t.meta.siteName}`,
    description: t.meta.homeDescription,
  });
}

/**
 * Answer-engine page. Each heading is a question people actually type, each
 * answer is self-contained and quotable, and FAQPage structured data lets a
 * search or AI assistant lift a single answer without losing its meaning.
 */
export default function Faq() {
  const { items, nonce } = useLoaderData<typeof loader>();
  const t = useT();

  return (
    <>
      <JsonLd data={faqSchema(items)} nonce={nonce} />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t.faq.title}
        </h1>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle">
          {items.map((item) => (
            <div key={item.q} className="grid gap-2 bg-surface p-6">
              <dt className="text-lg font-semibold text-balance">{item.q}</dt>
              <dd className="text-ink-2">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
