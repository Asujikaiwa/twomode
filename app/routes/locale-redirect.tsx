import { redirect, type LoaderFunctionArgs } from "react-router";

import { negotiateLocale } from "~/i18n/config";

/**
 * "/" never renders. It negotiates a language from the request and sends the
 * visitor to a real localized URL, so every indexable page has exactly one
 * canonical address.
 *
 * 302 rather than 301 on purpose: the target depends on the visitor's
 * Accept-Language, and a permanently cached redirect would pin the first
 * visitor's language for everyone behind the same cache.
 */
export function loader({ request }: LoaderFunctionArgs) {
  const locale = negotiateLocale(request.headers.get("accept-language"));
  return redirect(`/${locale}`, {
    status: 302,
    headers: { Vary: "Accept-Language" },
  });
}

export default function LocaleRedirect() {
  return null;
}
