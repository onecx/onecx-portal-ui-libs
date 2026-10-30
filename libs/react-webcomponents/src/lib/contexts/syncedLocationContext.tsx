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
 * Install only while a synced router is mounted. The shell checks top-level
 * `isRouterSync` in its history patch, while React Router nests user state under
 * `data.usr`. The shell installs its patch during bootstrap before mounting
 * React remotes, so this wrapper layers over the shell adapter and is removed
 * when the last synced router unmounts.
 */
type HistoryWrapperState = {
  referenceCount: number
  originalPushState: History['pushState']
  originalReplaceState: History['replaceState']
  wrappedPushState: History['pushState']
  wrappedReplaceState: History['replaceState']
}

const normalizeUrl = (url: string) => {
  const parsedUrl = new URL(url, window.location.origin)
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
}

const releaseHistorySyncMarker = (history: History, state: HistoryWrapperState) => {
  state.referenceCount -= 1
  if (state.referenceCount > 0) return

  if (history.pushState === state.wrappedPushState) {
    history.pushState = state.originalPushState
  }
  if (history.replaceState === state.wrappedReplaceState) {
    history.replaceState = state.originalReplaceState
  }
  delete (history as unknown as Record<string, unknown>)[HISTORY_WRAPPER_MARKER]
}

const installHistorySyncMarker = (): (() => void) => {
  const history = window.history
  const historyProperties = history as unknown as Record<string, unknown>
  const existingState = historyProperties[HISTORY_WRAPPER_MARKER] as HistoryWrapperState | undefined
  if (existingState) {
    existingState.referenceCount += 1
    return () => releaseHistorySyncMarker(history, existingState)
  }

  const propagateShellSyncMarker = (data: unknown) => {
    if (!data || typeof data !== 'object') return data

    const historyData = data as Record<string, unknown>
    const userState = historyData.usr
    if (!userState || typeof userState !== 'object' || !(SHELL_SYNC_MARKER in userState)) {
      return data
    }

    const cleanUserState = Object.fromEntries(Object.entries(userState).filter(([key]) => key !== SHELL_SYNC_MARKER))
    return {
      ...historyData,
      usr: cleanUserState,
      isRouterSync: true,
    }
  }

  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState
  const wrappedPushState: History['pushState'] = function (data, unused, url) {
    return originalPushState.call(history, propagateShellSyncMarker(data), unused, url)
  }
  const wrappedReplaceState: History['replaceState'] = function (data, unused, url) {
    return originalReplaceState.call(history, propagateShellSyncMarker(data), unused, url)
  }

  const wrapperState: HistoryWrapperState = {
    referenceCount: 1,
    originalPushState,
    originalReplaceState,
    wrappedPushState,
    wrappedReplaceState,
  }
  history.pushState = wrappedPushState
  history.replaceState = wrappedReplaceState
  Object.defineProperty(historyProperties, HISTORY_WRAPPER_MARKER, {
    configurable: true,
    value: wrapperState,
  })

  return () => releaseHistorySyncMarker(history, wrapperState)
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

  useLayoutEffect(() => installHistorySyncMarker(), [])

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

      const normalizedTargetUrl = normalizeUrl(topicUrl)
      if (skipPublishUntil.current === normalizedTargetUrl) {
        return
      }
      if (normalizeUrl(routerUrlRef.current) !== normalizedTargetUrl) {
        skipPublishUntil.current = normalizedTargetUrl
        setCurrentLocation({
          url: normalizedTargetUrl,
          isFirst: location.isFirst,
        })
        navigateRef.current(topicUrl, { replace: true, state: { [SHELL_SYNC_MARKER]: true } })
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
      if (normalizeUrl(routerUrl) === skipPublishUntil.current) {
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
