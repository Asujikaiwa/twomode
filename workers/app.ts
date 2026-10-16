import { RouterContextProvider, createRequestHandler } from "react-router";

import { cloudflareContext, nonceContext } from "../app/context";
import { api } from "../server/api/v1/index";
import { applySecurityHeaders, makeNonce } from "../server/http/security-headers";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // The API is JSON-only and needs no CSP or nonce; keeping it on its own
    // branch also keeps React Router out of the hot path for API calls.
    if (url.pathname.startsWith("/api/")) {
      return api.fetch(request, env, ctx);
    }

    const nonce = makeNonce();
    const context = new RouterContextProvider();
    context.set(cloudflareContext, { env, ctx });
    context.set(nonceContext, nonce);

    const response = await requestHandler(request, context);

    return applySecurityHeaders(response, {
      nonce,
      isProduction: env.ENVIRONMENT === "production",
    });
  },
} satisfies ExportedHandler<Env>;
