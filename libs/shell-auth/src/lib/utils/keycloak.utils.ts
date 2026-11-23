// Formats a Keycloak token expiry (seconds since epoch) for logging; 'unknown' when absent.
export const formatExpiry = (exp?: number): string => (exp ? new Date(exp * 1000).toISOString() : 'unknown')
