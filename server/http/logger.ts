/**
 * Structured logging. Two rules that are not negotiable:
 *   1. every line carries requestId, so one id ties a user report to the trace
 *   2. nothing that could be a secret or conversation content is ever logged
 */

const SECRET_PATTERNS: RegExp[] = [
  /sk-ant-[A-Za-z0-9_-]{10,}/g, // Anthropic
  /AIza[0-9A-Za-z_-]{20,}/g, // Google
  /\bBearer\s+[A-Za-z0-9._-]{10,}/gi,
];

/** Last line of defence: strip anything key-shaped before it reaches a log sink. */
export function redact(value: string): string {
  return SECRET_PATTERNS.reduce((acc, re) => acc.replace(re, "[redacted]"), value);
}

type Level = "debug" | "info" | "warn" | "error";

export type LogFields = {
  requestId: string;
  route?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  userId?: string;
  code?: string;
  [key: string]: unknown;
};

function emit(level: Level, message: string, fields: LogFields): void {
  const line = JSON.stringify({
    level,
    message: redact(message),
    time: new Date().toISOString(),
    ...fields,
  });
  // Workers ships console output to Workers Logs / a tail worker.
  if (level === "error") console.error(redact(line));
  else if (level === "warn") console.warn(redact(line));
  else console.log(redact(line));
}

export const log = {
  debug: (message: string, fields: LogFields) => emit("debug", message, fields),
  info: (message: string, fields: LogFields) => emit("info", message, fields),
  warn: (message: string, fields: LogFields) => emit("warn", message, fields),
  error: (message: string, fields: LogFields) => emit("error", message, fields),
};

export function newRequestId(): string {
  return crypto.randomUUID();
}
