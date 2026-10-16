import { describe, expect, it } from "vitest";

import { ApiError, ERROR_CODES, isRetryable, toApiError } from "../../server/http/errors";
import { redact } from "../../server/http/logger";
import { contentSecurityPolicy, makeNonce } from "../../server/http/security-headers";

describe("error contract", () => {
  it("gives every code an HTTP status", () => {
    for (const code of ERROR_CODES) {
      const err = new ApiError(code, "x");
      expect(err.status, code).toBeGreaterThanOrEqual(400);
      expect(err.status, code).toBeLessThan(600);
    }
  });

  it("marks only transient failures as retryable", () => {
    // Retrying a bad key would burn the user's quota on a call that can never
    // succeed, so this list must stay short and deliberate.
    expect(isRetryable("PROVIDER_RATE_LIMITED")).toBe(true);
    expect(isRetryable("PROVIDER_UNAVAILABLE")).toBe(true);
    expect(isRetryable("PROVIDER_KEY_INVALID")).toBe(false);
    expect(isRetryable("VALIDATION_FAILED")).toBe(false);
    expect(isRetryable("FORBIDDEN")).toBe(false);
  });

  it("serialises with the request id and omits absent optional fields", () => {
    const body = new ApiError("RATE_LIMITED", "slow down", { retryAfterMs: 4200 }).toBody("req-1");
    expect(body.error).toMatchObject({
      code: "RATE_LIMITED",
      retryable: true,
      retryAfterMs: 4200,
      requestId: "req-1",
    });
    expect("details" in body.error).toBe(false);
  });

  it("never leaks an unexpected error's message to the client", () => {
    const converted = toApiError(new Error("D1_ERROR: connection string user=admin"));
    expect(converted.code).toBe("INTERNAL");
    expect(converted.message).not.toContain("admin");
  });
});

describe("log redaction", () => {
  it("strips provider key shapes", () => {
    expect(redact("key sk-ant-api03-AbCdEf0123456789 used")).not.toContain("AbCdEf");
    expect(redact("AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5")).toBe("[redacted]");
    expect(redact("Authorization: Bearer abcdef0123456789")).toContain("[redacted]");
  });

  it("leaves ordinary text alone", () => {
    expect(redact("user 42 opened conversation")).toBe("user 42 opened conversation");
  });
});

describe("content security policy", () => {
  it("binds scripts to the request nonce and forbids inline script", () => {
    const csp = contentSecurityPolicy({ nonce: "abc123" });
    expect(csp).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });

  it("issues a fresh nonce each time", () => {
    const a = makeNonce();
    const b = makeNonce();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(16);
  });
});
