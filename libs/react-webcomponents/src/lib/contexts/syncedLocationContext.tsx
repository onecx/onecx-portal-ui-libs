import { createContext, type FC, type PropsWithChildren, type ReactNode, useEffect, useState } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router'
import { CurrentLocationTopic, type CurrentLocationTopicPayload } from '@onecx/integration-interface'

/** Initial synced location value. */
const initValue = {
  url: '',
  isFirst: true,
}

/**
 * React context carrying the current synced location payload.
 */
export const SyncedLocationContext = createContext<CurrentLocationTopicPayload>(initValue)

/**
 * Internal router sync component subscribing to current location topic.
 * @param children - nested content rendered with synced location context.
 * @returns Provider for synced location state.
 */
const RouterSync: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()
  const locationHook = useLocation()
  const [currentLocation, setCurrentLocation] = useState<CurrentLocationTopicPayload>({
    url: locationHook.pathname,
    isFirst: false,
  })

  useEffect(() => {
    const locationSubscription = new CurrentLocationTopic().subscribe((location) => {
      const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/'
      const normalizedBaseHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`
      if (locationHook.pathname !== location.url) {
        setCurrentLocation(() => {
          const rawUrl = location.url ?? locationHook.pathname
          const normalizedUrl = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
          const urlWithBase = normalizedUrl.startsWith(normalizedBaseHref)
            ? normalizedUrl
            : `${normalizedBaseHref}${normalizedUrl.replace(/^\//, '')}`
          locationHook.pathname = urlWithBase
          const newValue = {
            url: locationHook.pathname,
            isFirst: location.isFirst,
          }
          navigate(newValue.url, { replace: true })
          return newValue
        })
      }
    })

    return () => {
      locationSubscription.unsubscribe()
    }
  }, [])

  return <SyncedLocationContext.Provider value={currentLocation}>{children}</SyncedLocationContext.Provider>
}

/**
 * Wraps children with BrowserRouter and synced location provider.
 * @param children - content to render inside the synced router.
 * @returns Router provider component.
 */
export const SyncedRouterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <RouterSync>{children}</RouterSync>
    </BrowserRouter>
  )
}
