/**
 * Security headers applied to every HTML response.
 *
 * The CSP uses a per-request nonce and has no 'unsafe-inline' for scripts —
 * which is the only version of a CSP that actually stops injected script.
 * Any inline <script> must therefore carry the same nonce.
 */

export function makeNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

type CspOptions = {
  nonce: string;
  /** Report-only while rolling out a policy change, enforced afterwards. */
  reportOnly?: boolean;
};

export function contentSecurityPolicy({ nonce }: CspOptions): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // Google Fonts serves its stylesheet from a separate origin than its files.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    // Provider calls happen server-side; the browser never talks to them.
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function applySecurityHeaders(
  response: Response,
  options: CspOptions & { isProduction: boolean },
): Response {
  const headers = new Headers(response.headers);

  const cspHeader = options.reportOnly
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";
  headers.set(cspHeader, contentSecurityPolicy(options));

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  );
  headers.set("Cross-Origin-Opener-Policy", "same-origin");

  // HSTS only in production: sending it from localhost would pin http://localhost
  // to https in the developer's browser and break local dev for weeks.
  if (options.isProduction) {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
