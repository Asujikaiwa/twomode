import { Hono } from "hono";

import { ApiError, toApiError } from "../../http/errors";
import { log, newRequestId } from "../../http/logger";

type Bindings = { Bindings: Env; Variables: { requestId: string } };

/**
 * Versioned API. Everything under /api/v1 shares one middleware chain, so a
 * new route cannot accidentally skip request ids or the error contract.
 */
export const api = new Hono<Bindings>().basePath("/api/v1");

api.use("*", async (c, next) => {
  const requestId = c.req.header("x-request-id") ?? newRequestId();
  c.set("requestId", requestId);
  c.header("x-request-id", requestId);

  const startedAt = Date.now();
  await next();

  log.info("request", {
    requestId,
    method: c.req.method,
    route: new URL(c.req.url).pathname,
    status: c.res.status,
    durationMs: Date.now() - startedAt,
  });
});

api.onError((err, c) => {
  const requestId = c.get("requestId") ?? newRequestId();
  const apiError = toApiError(err);

  log.error(err instanceof Error ? err.message : "unknown error", {
    requestId,
    code: apiError.code,
    route: new URL(c.req.url).pathname,
    status: apiError.status,
  });

  if (apiError.retryAfterMs !== undefined) {
    c.header("Retry-After", String(Math.ceil(apiError.retryAfterMs / 1000)));
  }
  return c.json(apiError.toBody(requestId), apiError.status as 400);
});

api.notFound((c) => {
  const requestId = c.get("requestId") ?? newRequestId();
  const err = new ApiError("NOT_FOUND", `No route for ${c.req.method} ${c.req.path}`);
  return c.json(err.toBody(requestId), 404);
});

/**
 * Liveness probe. Deliberately does not touch D1: this endpoint answers
 * "is the Worker running", and a separate readiness check answers
 * "can it reach its dependencies". Conflating the two makes alerts lie.
 */
api.get("/health", (c) =>
  c.json({
    status: "ok",
    environment: c.env.ENVIRONMENT,
    requestId: c.get("requestId"),
    time: new Date().toISOString(),
  }),
);

api.get("/ready", async (c) => {
  try {
    await c.env.DB.prepare("select 1").first();
    return c.json({ status: "ready", requestId: c.get("requestId") });
  } catch {
    throw new ApiError("PROVIDER_UNAVAILABLE", "Database is not reachable");
  }
});

export type ApiType = typeof api;
