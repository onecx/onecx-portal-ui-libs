/**
 * Helpers for reading the expiry claim out of a stored Keycloak refresh token.
 *
 * A refresh token is a JWT whose segments are base64url encoded (RFC 4648 section 5): `-` and `_`
 * instead of `+` and `/`, with padding omitted. `atob` only accepts standard base64, so the payload
 * segment must be translated back and re-padded before it can be decoded. Any input that is not a
 * decodable JWT (wrong segment count, invalid base64url, invalid JSON, or a non-numeric `exp`)
 * yields `undefined` so a corrupt local storage entry cannot take the shell down at start.
 */

/**
 * Decodes the payload of a stored refresh token and returns its `exp` claim in seconds, or
 * `undefined` when the token is not a decodable JWT or its `exp` is not a number.
 */
export function getRefreshTokenExp(refreshToken: string): number | undefined {
  const segments = refreshToken.split('.')
  if (segments.length !== 3) {
    return undefined
  }
  try {
    const base64 = segments[1].replaceAll('-', '+').replaceAll('_', '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const payload = JSON.parse(atob(padded)) as { exp?: unknown }
    return typeof payload.exp === 'number' ? payload.exp : undefined
  } catch {
    return undefined
  }
}

/**
 * A refresh token is unusable when it expired before `now` (in milliseconds) or when it could not
 * be decoded at all (`exp` is `undefined`). An undecodable token is treated like an expired one so
 * the shell starts with a fresh login instead of failing.
 */
export function isStoredRefreshTokenExpired(exp: number | undefined, now: number): boolean {
  return exp === undefined || exp * 1000 < now
}

/** Formats the stored refresh token expiry in seconds for logging, or `unknown` when it is absent. */
export function formatStoredRefreshTokenExpiry(exp: number | undefined): string {
  return exp === undefined ? 'unknown' : new Date(exp * 1000).toISOString()
}
