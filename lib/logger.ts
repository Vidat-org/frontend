import "server-only"

import { Logtail } from "@logtail/node"

type LogContext = Record<string, unknown>
type LogLevel = "debug" | "info" | "warn" | "error"

const requestIds = new WeakMap<Request, string>()
const sensitiveKeys = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "apikey",
  "api_key",
  "rawkey",
  "token",
  "secret",
  "password",
])

const betterStackSourceToken = process.env.BETTER_STACK_SOURCE_TOKEN?.trim()
const betterStackEndpoint =
  process.env.BETTER_STACK_INGESTING_URL?.trim() ||
  process.env.BETTER_STACK_ENDPOINT?.trim()

const betterStack =
  betterStackSourceToken && betterStackSourceToken.length > 0
    ? new Logtail(betterStackSourceToken, {
        ...(betterStackEndpoint ? { endpoint: betterStackEndpoint } : {}),
        sendLogsToConsoleOutput: false,
      })
    : null

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return {
    error,
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function shouldRedactKey(key: string) {
  const normalized = key.trim().toLowerCase()

  return (
    sensitiveKeys.has(normalized) ||
    normalized.endsWith("_token") ||
    normalized.endsWith("_secret") ||
    normalized.includes("password")
  )
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry))
  }

  if (isPlainObject(value)) {
    const sanitizedEntries = Object.entries(value).map(([key, entry]) => [
      key,
      shouldRedactKey(key) ? "[REDACTED]" : sanitizeValue(entry),
    ])

    return Object.fromEntries(sanitizedEntries)
  }

  if (typeof value === "string") {
    if (value.startsWith("Bearer ")) {
      return "Bearer [REDACTED]"
    }

    return value
  }

  return value
}

function sanitizeContext(context?: LogContext) {
  if (!context) {
    return undefined
  }

  return sanitizeValue(context) as LogContext
}

function writeConsole(level: LogLevel, message: string, context?: LogContext) {
  const sanitizedContext = sanitizeContext(context)
  const consoleMethod =
    level === "debug"
      ? console.debug
      : level === "info"
        ? console.info
        : level === "warn"
          ? console.warn
          : console.error

  if (sanitizedContext && Object.keys(sanitizedContext).length > 0) {
    consoleMethod(message, sanitizedContext)
    return
  }

  consoleMethod(message)
}

async function writeBetterStack(
  level: LogLevel,
  message: string,
  context?: LogContext
) {
  if (!betterStack) {
    return
  }

  try {
    await betterStack.log(message, level, sanitizeContext(context))
  } catch (error) {
    console.error("[logger] Better Stack send failed", normalizeError(error))
  }
}

function emit(level: LogLevel, message: string, context?: LogContext) {
  writeConsole(level, message, context)
  void writeBetterStack(level, message, context)
}

function createLogger(boundContext: LogContext = {}) {
  return {
    debug(message: string, context?: LogContext) {
      emit("debug", message, { ...boundContext, ...context })
    },
    info(message: string, context?: LogContext) {
      emit("info", message, { ...boundContext, ...context })
    },
    warn(message: string, context?: LogContext) {
      emit("warn", message, { ...boundContext, ...context })
    },
    error(message: string, error?: unknown, context?: LogContext) {
      emit("error", message, {
        ...boundContext,
        ...context,
        ...(error === undefined ? {} : { error: normalizeError(error) }),
      })
    },
    child(context: LogContext) {
      return createLogger({ ...boundContext, ...context })
    },
    async flush() {
      await betterStack?.flush()
    },
  }
}

export const logger = createLogger({
  service: "vidat-frontend",
  environment: process.env.NODE_ENV ?? "development",
})

export function getRequestId(request: Request) {
  const existing = requestIds.get(request)

  if (existing) {
    return existing
  }

  const incoming =
    request.headers.get("x-request-id") ||
    request.headers.get("x-correlation-id") ||
    crypto.randomUUID()

  requestIds.set(request, incoming)
  return incoming
}

export function getRequestLogger(request: Request, context: LogContext = {}) {
  const url = new URL(request.url)

  return logger.child({
    requestId: getRequestId(request),
    route: url.pathname,
    method: request.method,
    ...context,
  })
}

export function withRequestId(
  request: Request,
  response: Response,
  extraHeaders?: HeadersInit
) {
  const headers = new Headers(response.headers)
  headers.set("x-request-id", getRequestId(request))

  if (extraHeaders) {
    const additional = new Headers(extraHeaders)

    additional.forEach((value, key) => {
      headers.set(key, value)
    })
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
