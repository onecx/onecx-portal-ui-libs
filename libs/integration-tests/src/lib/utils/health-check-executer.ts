import { HealthCheck } from 'testcontainers/build/types'

/**
 * Extract URL from health check test command
 * @param healthCheck The health check configuration containing the test command
 * @returns The extracted URL or null if no URL found
 */
export function extractUrlFromHealthCheck(healthCheck: HealthCheck | undefined): string | null {
  if (!healthCheck?.test || !Array.isArray(healthCheck.test)) {
    return null
  }

  // Join all test command parts into a single string
  const testCommand = healthCheck.test.join(' ')

  // Look for HTTP/HTTPS URLs - more flexible pattern that supports various hostnames
  const urlRegex = /https?:\/\/[^\s"']+/
  const match = testCommand.match(urlRegex)

  return match ? match[0] : null
}

/**
 * Extract health check path from health check test command
 * @param healthCheck The health check configuration
 * @returns The extracted path or null if not found
 */
export function extractHealthCheckPath(healthCheck: HealthCheck | undefined): string | null {
  const url = extractUrlFromHealthCheck(healthCheck)

  if (!url) {
    return null
  }

  // Extract path from URL (everything after hostname:port)
  const pathMatch = url.match(/https?:\/\/[^\/]+(.*)/)

  if (!pathMatch || !pathMatch[1]) {
    return null
  }

  const path = pathMatch[1]

  // Return the path, ensure it starts with /
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * Extract base URL (protocol + host) from a complete URL
 * @param url The complete URL to extract from
 * @returns Base URL (protocol://host) or null if extraction fails
 */
export function extractBaseUrl(url: string): string | null {
  const baseUrlMatch = url.match(/(https?:\/\/[^\/]+)/)
  return baseUrlMatch ? baseUrlMatch[1] : null
}

/**
 * Replace port in a base URL with a new mapped port
 * @param baseUrl The base URL (protocol://host:port)
 * @param mappedPort The new port to use
 * @returns Base URL with mapped port
 */
export function replacePortInBaseUrl(baseUrl: string, mappedPort: number): string {
  return baseUrl.replace(/:\d+$/, `:${mappedPort}`)
}

/**
 * Combine base URL with path to create complete URL
 * @param baseUrl The base URL (protocol://host:port)
 * @param path The path to append (can be empty)
 * @returns Complete URL
 */
export function combineUrlWithPath(baseUrl: string, path: string): string {
  return `${baseUrl}${path}`
}

/**
 * Build complete health check URL with mapped port from health check configuration
 * Extracts protocol, host and path from health check command
 * @param mappedPort The mapped port to use
 * @param healthCheck The health check configuration (required)
 * @returns Complete health check URL or null if no URL can be extracted
 */
export function buildHealthCheckUrl(mappedPort: number, healthCheck: HealthCheck): string | null {
  const extractedUrl = extractUrlFromHealthCheck(healthCheck)

  if (!extractedUrl) {
    return null
  }

  const baseUrl = extractBaseUrl(extractedUrl)

  if (!baseUrl) {
    return null
  }

  const baseUrlWithMappedPort = replacePortInBaseUrl(baseUrl, mappedPort)
  const extractedPath = extractHealthCheckPath(healthCheck)
  const path = extractedPath || ''

  return combineUrlWithPath(baseUrlWithMappedPort, path)
}
