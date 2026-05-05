import { useEffect, useState } from 'react'
import { firstValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import { useAppState, useConfiguration } from '@onecx/react-integration-interface'
import { normalizeHref, removeTrailingSlash } from '../utils/href.utils'

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
