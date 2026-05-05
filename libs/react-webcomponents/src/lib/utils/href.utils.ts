/**
 * Remove trailing slash from a URL string.
 * @param url - url to normalize.
 * @returns url without trailing slash.
 */
export const removeTrailingSlash = (url: string): string => {
  let end = url.length
  while (end > 0 && url.charCodeAt(end - 1) === 47) {
    end -= 1
  }
  return end === url.length ? url : url.slice(0, end)
}

/**
 * Combine app base href with a route base href and normalize the result.
 * @param appBaseHref - base href configured for the app.
 * @param baseHref - base href of the current MFE.
 * @returns normalized href without trailing slash.
 */
export const normalizeHref = (appBaseHref: string, baseHref: string): string => {
  const cleanedAppBaseHref = removeTrailingSlash(appBaseHref)
  const cleanedBaseHref = baseHref.replace(/^\//, '')
  const normalizedHref = `${cleanedAppBaseHref}/${cleanedBaseHref}`
  return removeTrailingSlash(normalizedHref)
}
