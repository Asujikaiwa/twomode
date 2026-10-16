/**
 * One error shape for the entire API. Clients branch on `code`, never on the
 * human-readable message, so translations and copy edits can never break them.
 */

export const ERROR_CODES = [
  "BAD_REQUEST",
  "VALIDATION_FAILED",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "IDEMPOTENCY_REPLAY",
  "RATE_LIMITED",
  "PROVIDER_KEY_MISSING",
  "PROVIDER_KEY_INVALID",
  "PROVIDER_RATE_LIMITED",
  "PROVIDER_UNAVAILABLE",
  "TOKEN_BUDGET_EXCEEDED",
  "INTERNAL",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type ErrorDetail = { path: string; issue: string };

export type ApiErrorBody = {
  error: {
    code: ErrorCode;
    message: string;
    retryable: boolean;
    retryAfterMs?: number;
    requestId: string;
    details?: ErrorDetail[];
  };
};

const STATUS: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_FAILED: 422,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  IDEMPOTENCY_REPLAY: 409,
  RATE_LIMITED: 429,
  PROVIDER_KEY_MISSING: 400,
  PROVIDER_KEY_INVALID: 400,
  PROVIDER_RATE_LIMITED: 429,
  PROVIDER_UNAVAILABLE: 502,
  TOKEN_BUDGET_EXCEEDED: 409,
  INTERNAL: 500,
};

/** Only these are worth retrying — retrying anything else burns the user's quota. */
const RETRYABLE: ReadonlySet<ErrorCode> = new Set<ErrorCode>([
  "RATE_LIMITED",
  "PROVIDER_RATE_LIMITED",
  "PROVIDER_UNAVAILABLE",
  "INTERNAL",
]);

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly retryable: boolean;
  readonly retryAfterMs: number | undefined;
  readonly details: ErrorDetail[] | undefined;

  constructor(
    code: ErrorCode,
    message: string,
    options: { retryAfterMs?: number; details?: ErrorDetail[] } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = STATUS[code];
    this.retryable = RETRYABLE.has(code);
    this.retryAfterMs = options.retryAfterMs;
    this.details = options.details;
  }

  toBody(requestId: string): ApiErrorBody {
    return {
      error: {
        code: this.code,
        message: this.message,
        retryable: this.retryable,
        ...(this.retryAfterMs === undefined ? {} : { retryAfterMs: this.retryAfterMs }),
        requestId,
        ...(this.details === undefined ? {} : { details: this.details }),
      },
    };
  }
}

export function statusForCode(code: ErrorCode): number {
  return STATUS[code];
}

export function isRetryable(code: ErrorCode): boolean {
  return RETRYABLE.has(code);
}

/**
 * Turns anything thrown into the public error shape. Unknown errors never leak
 * their message to the client — the message goes to the log, the id goes out.
 */
export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError("INTERNAL", "Unexpected server error");
}
