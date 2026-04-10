"use client"

export const COOKIE_CONSENT_COOKIE_NAME = "cookieConsent"
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365
export const COOKIE_CONSENT_VERSION = "2026-04-10"
export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const THEME_STORAGE_KEY = "theme"
export const COOKIE_CONSENT_EVENT = "vidat:cookie-consent-changed"

export type CookieConsentStatus = "unknown" | "accepted" | "rejected"

function parseConsentValue(value?: string | null): CookieConsentStatus {
  if (!value) {
    return "unknown"
  }

  const [version, status] = value.split(":")

  if (
    version === COOKIE_CONSENT_VERSION &&
    (status === "accepted" || status === "rejected")
  ) {
    return status
  }

  return "unknown"
}

export function readCookieConsent(): CookieConsentStatus {
  if (typeof document === "undefined") {
    return "unknown"
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_CONSENT_COOKIE_NAME}=`))

  return parseConsentValue(cookie?.split("=")[1] ?? null)
}

export function writeCookieConsent(
  status: Exclude<CookieConsentStatus, "unknown">
) {
  if (typeof document === "undefined") {
    return
  }

  document.cookie =
    `${COOKIE_CONSENT_COOKIE_NAME}=${COOKIE_CONSENT_VERSION}:${status}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; samesite=lax`
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

export function clearNonEssentialStorage() {
  deleteCookie(SIDEBAR_COOKIE_NAME)

  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY)
  } catch {}
}

export function hasOptionalCookieConsent(status: CookieConsentStatus) {
  return status === "accepted"
}

export function readOptionalLocalStorage(
  key: string,
  status: CookieConsentStatus
) {
  if (!hasOptionalCookieConsent(status) || typeof window === "undefined") {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeOptionalLocalStorage(
  key: string,
  value: string,
  status: CookieConsentStatus
) {
  if (typeof window === "undefined") {
    return
  }

  if (!hasOptionalCookieConsent(status)) {
    try {
      window.localStorage.removeItem(key)
    } catch {}

    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {}
}

export function writeOptionalCookie(
  name: string,
  value: string,
  maxAge: number,
  status: CookieConsentStatus
) {
  if (typeof document === "undefined") {
    return
  }

  if (!hasOptionalCookieConsent(status)) {
    deleteCookie(name)
    return
  }

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`
}

export function emitCookieConsentChanged(status: CookieConsentStatus) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, {
      detail: { status },
    })
  )
}
