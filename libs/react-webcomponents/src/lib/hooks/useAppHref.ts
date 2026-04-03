import { useEffect, useState } from 'react'
import { firstValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import { useAppState, useConfiguration } from '@onecx/react-integration-interface'

/**
 * Combine app base href with a route base href and normalize the result.
 * @param appBaseHref - base href configured for the app.
 * @param baseHref - base href of the current MFE.
 * @returns normalized href without trailing slash.
 */
const normalizeHref = (appBaseHref: string, baseHref: string): string => {
  const cleanedAppBaseHref = appBaseHref.replace(/\/$/, '')
  const cleanedBaseHref = baseHref.replace(/^\//, '')
  const normalizedHref = `${cleanedAppBaseHref}/${cleanedBaseHref}`
  return removeTrailingSlash(normalizedHref)
}
/**
 * Remove trailing slash from a URL string.
 * @param url - url to normalize.
 * @returns url without trailing slash.
 */
const removeTrailingSlash = (url: string): string => {
  return url.replace(/\/$/, '')
}

/**
 * Hook to access baseUrl, appBaseHref and href.
 * Must be used within Configuration and AppState Contexts.
 *
 * @returns Object with baseUrl, appBaseHref and normalized href.
 */
export const useAppHref = () => {
  const { currentMfe$, currentWorkspace$ } = useAppState()
  const { config } = useConfiguration()
  const [hrefs, setHrefs] = useState({
    baseUrl: '',
    appBaseHref: '',
    baseHref: '',
  })

  useEffect(() => {
    const fetchBaseHref = async () => {
      const baseHref: string = currentMfe$
        ? await firstValueFrom(currentMfe$.pipe(map((data: { baseHref?: string }) => data.baseHref || '')))
        : ''
      const baseUrl: string = currentWorkspace$
        ? await firstValueFrom(currentWorkspace$.pipe(map((data: { baseUrl?: string }) => data.baseUrl || '')))
        : ''
      const appBaseHref = config?.APP_BASE_HREF ?? ''

      setHrefs({ baseUrl, appBaseHref, baseHref })
    }

    fetchBaseHref()
  }, [currentMfe$, currentWorkspace$, config])

  const href = normalizeHref(hrefs.appBaseHref, hrefs.baseHref)

  return {
    baseUrl: hrefs.baseUrl,
    appBaseHref: removeTrailingSlash(hrefs.appBaseHref),
    href,
  }
}
