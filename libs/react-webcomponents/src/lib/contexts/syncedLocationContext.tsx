import { createContext, type FC, type PropsWithChildren, type ReactNode, useEffect, useRef, useState } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router'
import { CurrentLocationTopic, type CurrentLocationTopicPayload } from '@onecx/integration-interface'
import { useTopic } from '@onecx/react-integration-interface'

/**
 * React context carrying the current synced location payload.
 */
export const SyncedLocationContext = createContext<CurrentLocationTopicPayload | undefined>(undefined)

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
  const pathnameRef = useRef(locationHook.pathname)
  pathnameRef.current = locationHook.pathname

  const currentLocation$ = useTopic(undefined, CurrentLocationTopic)

  useEffect(() => {
    const locationSubscription = currentLocation$.subscribe((location) => {
      const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/'
      const normalizedBaseHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`
      if (pathnameRef.current !== location.url) {
        setCurrentLocation(() => {
          const rawUrl = location.url ?? pathnameRef.current
          const normalizedUrl = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
          const urlWithBase = normalizedUrl.startsWith(normalizedBaseHref)
            ? normalizedUrl
            : `${normalizedBaseHref}${normalizedUrl.replace(/^\//, '')}`
          const newValue = {
            url: urlWithBase,
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
  }, [currentLocation$, navigate])

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
