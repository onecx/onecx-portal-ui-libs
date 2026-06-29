import {
  createContext,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { BrowserRouter, useLocation } from 'react-router'
import { CurrentLocationTopic, type CurrentLocationTopicPayload } from '@onecx/integration-interface'
import { useTopic, createLogger } from '@onecx/react-integration-interface'

/**
 * React context carrying the current synced location payload.
 */
export const SyncedLocationContext = createContext<CurrentLocationTopicPayload | undefined>(undefined)

/**
 * Internal router sync component subscribing to current location topic.
 * @param children - nested content rendered with synced location context.
 * @returns Provider for synced location state.
 */
const logger = createLogger('RouterSync')

const RouterSync: FC<PropsWithChildren> = ({ children }) => {
  const locationHook = useLocation()
  const [currentLocation, setCurrentLocation] = useState<CurrentLocationTopicPayload>({
    url: locationHook.pathname,
    isFirst: false,
  })
  const pathnameRef = useRef(locationHook.pathname)
  const skipPublishUntil = useRef<string | null>(null)
  const currentLocation$ = useTopic(undefined, CurrentLocationTopic)

  useEffect(() => {
    pathnameRef.current = locationHook.pathname
  })

  useEffect(() => {
    const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/'
    const normalizedBaseHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`

    const locationSubscription = currentLocation$.subscribe((location) => {
      const topicUrl = location.url ?? ''
      if (topicUrl !== '/' && topicUrl !== '' && !topicUrl.startsWith(normalizedBaseHref)) {
        return
      }

      if (pathnameRef.current !== location.url) {
        // Mark that this URL came from the topic — don't publish it back.
        // BrowserRouter will see the URL change via window.location
        // because the shell updates it, so we do NOT call navigate() here.
        skipPublishUntil.current = location.url ?? null
        setCurrentLocation({
          url: location.url ?? pathnameRef.current,
          isFirst: location.isFirst,
        })
      }
    })

    return () => {
      locationSubscription.unsubscribe()
    }
  }, [currentLocation$])

  // Publish internal navigation changes so the shell can update the browser URL.
  // skipPublishUntil prevents echoing topic-driven navigations.
  // useLayoutEffect runs synchronously after DOM mutations so there is no
  // extra render between the URL change and the publish.
  useLayoutEffect(() => {
    if (skipPublishUntil.current !== null) {
      if (locationHook.pathname === skipPublishUntil.current) {
        skipPublishUntil.current = null // reached the target, clear the guard
      }
      return
    }
    if (locationHook.pathname !== currentLocation.url) {
      currentLocation$
        .publish({
          url: locationHook.pathname,
          isFirst: false,
        })
        .catch((err) => {
          logger.error('publish failed:', err)
        })
    }
  }, [locationHook.pathname, currentLocation.url, currentLocation$])

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
