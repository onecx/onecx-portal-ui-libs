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
import { BrowserRouter, useLocation, useNavigate } from 'react-router'
import { CurrentLocationTopic, type CurrentLocationTopicPayload } from '@onecx/integration-interface'
import { useTopic } from '@onecx/react-integration-interface'
import { createLogger } from '../utils/logger.utils'

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

const toUrl = ({ pathname, search, hash }: { pathname: string; search: string; hash: string }) =>
  `${pathname}${search}${hash}`

const SHELL_SYNC_MARKER = '__onecxShellSync'
const HISTORY_WRAPPER_MARKER = '__onecxRouterSyncWrapped'

/**
 * The shell patches history.pushState/replaceState and publishes CurrentLocationTopic
 * for every call that does NOT contain top-level `isRouterSync`.
 * React Router stores user state under `data.usr`, so the marker would be invisible
 * to the shell. This wrapper copies our marker to the top level before the shell
 * patch runs, preventing an echo back to the shell when we navigate from a topic
 * event. Internal React Router navigation keeps publishing normally.
 */
if (typeof window !== 'undefined' && !(window.history as unknown as Record<string, boolean>)[HISTORY_WRAPPER_MARKER]) {
  const pushState = window.history.pushState.bind(window.history)
  const replaceState = window.history.replaceState.bind(window.history)

  const propagateShellSyncMarker = (data: unknown) => {
    if (data && typeof data === 'object') {
      const state = (data as Record<string, unknown>).usr
      if (state && typeof state === 'object' && (state as Record<string, unknown>)[SHELL_SYNC_MARKER]) {
        ;(data as Record<string, unknown>).isRouterSync = true
        delete (state as Record<string, unknown>)[SHELL_SYNC_MARKER]
      }
    }
    return data
  }

  window.history.pushState = function (data: unknown, unused: string, url?: string | URL | null) {
    return pushState(propagateShellSyncMarker(data), unused, url as string)
  }
  window.history.replaceState = function (data: unknown, unused: string, url?: string | URL | null) {
    return replaceState(propagateShellSyncMarker(data), unused, url as string)
  }

  ;(window.history as unknown as Record<string, boolean>)[HISTORY_WRAPPER_MARKER] = true
}

const RouterSync: FC<PropsWithChildren> = ({ children }) => {
  const locationHook = useLocation()
  const navigate = useNavigate()
  const routerUrl = toUrl(locationHook)
  const [currentLocation, setCurrentLocation] = useState<CurrentLocationTopicPayload>({
    url: routerUrl,
    isFirst: false,
  })
  const routerUrlRef = useRef(routerUrl)
  const navigateRef = useRef(navigate)
  const skipPublishUntil = useRef<string | null>(null)
  const currentLocation$ = useTopic(undefined, CurrentLocationTopic)

  useLayoutEffect(() => {
    navigateRef.current = navigate
  })

  useEffect(() => {
    const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/'
    const normalizedBaseHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`

    const locationSubscription = currentLocation$.subscribe((location) => {
      const topicUrl = location.url
      if (!topicUrl) {
        return
      }
      if (topicUrl !== '/' && !topicUrl.startsWith(normalizedBaseHref)) {
        return
      }

      const targetUrl = topicUrl
      if (skipPublishUntil.current === targetUrl) {
        return
      }
      if (routerUrlRef.current !== targetUrl) {
        skipPublishUntil.current = targetUrl
        setCurrentLocation({
          url: targetUrl,
          isFirst: location.isFirst,
        })
        navigateRef.current(targetUrl, { replace: true, state: { [SHELL_SYNC_MARKER]: true } })
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
    routerUrlRef.current = routerUrl
    if (skipPublishUntil.current !== null) {
      if (routerUrl === skipPublishUntil.current) {
        skipPublishUntil.current = null
      }
      return
    }
    if (routerUrl !== currentLocation.url) {
      setCurrentLocation({ url: routerUrl, isFirst: false })
      currentLocation$
        .publish({
          url: routerUrl,
          isFirst: false,
        })
        .catch((err) => {
          logger.error('publish failed:', err)
        })
    }
  }, [routerUrl, currentLocation.url, currentLocation$])

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
