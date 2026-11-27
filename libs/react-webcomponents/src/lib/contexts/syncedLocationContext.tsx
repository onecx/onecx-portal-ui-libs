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
const TOPIC_NAVIGATION_TIMEOUT_MS = 1000
const OWN_PUBLISH_TTL_MS = 5000
const MAX_OWN_PUBLISHED_URLS = 10

type OwnPublish = { url: string; publishedAt: number }
type TopicNavigation = { target: string; locationKey: string; timeout: ReturnType<typeof setTimeout> }

/**
 * Install only while a synced router is mounted. The shell checks top-level
 * `isRouterSync` in its history patch, while React Router nests user state under
 * `data.usr`. The shell installs its patch during bootstrap before mounting
 * React remotes, so this wrapper layers over the shell adapter.
 *
 * The wrapper is restored by the last unmount when it is still the top-most patch.
 * If another patch was layered on top, the wrapper stays in the chain as a
 * pass-through (`referenceCount` 0) and is reused by the next mount instead of
 * being stacked again.
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

  if (history.pushState === state.wrappedPushState) history.pushState = state.originalPushState
  if (history.replaceState === state.wrappedReplaceState) history.replaceState = state.originalReplaceState
  if (history.pushState === state.originalPushState && history.replaceState === state.originalReplaceState) {
    delete (history as unknown as Record<string, unknown>)[HISTORY_WRAPPER_MARKER]
  }
}

const installHistorySyncMarker = (): (() => void) => {
  const history = window.history
  const historyProperties = history as unknown as Record<string, unknown>
  const existingState = historyProperties[HISTORY_WRAPPER_MARKER] as HistoryWrapperState | undefined
  if (existingState) {
    existingState.referenceCount += 1
    if (history.pushState === existingState.originalPushState) history.pushState = existingState.wrappedPushState
    if (history.replaceState === existingState.originalReplaceState) {
      history.replaceState = existingState.wrappedReplaceState
    }
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
  const wrapperState: HistoryWrapperState = {
    referenceCount: 1,
    originalPushState,
    originalReplaceState,
    wrappedPushState: originalPushState,
    wrappedReplaceState: originalReplaceState,
  }
  wrapperState.wrappedPushState = function (data, unused, url) {
    const state = wrapperState.referenceCount > 0 ? propagateShellSyncMarker(data) : data
    return originalPushState.call(history, state, unused, url)
  }
  wrapperState.wrappedReplaceState = function (data, unused, url) {
    const state = wrapperState.referenceCount > 0 ? propagateShellSyncMarker(data) : data
    return originalReplaceState.call(history, state, unused, url)
  }
  history.pushState = wrapperState.wrappedPushState
  history.replaceState = wrapperState.wrappedReplaceState
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
    url: locationHook.pathname,
    isFirst: false,
  })
  const routerUrlRef = useRef(routerUrl)
  const locationKeyRef = useRef(locationHook.key)
  const navigateRef = useRef(navigate)
  const topicNavigation = useRef<TopicNavigation | null>(null)
  const pendingTopicUrlRef = useRef<string | null>(null)
  const ownPublishedUrlsRef = useRef<OwnPublish[]>([])
  const lastPublishedUrlRef = useRef(routerUrl)
  const currentLocation$ = useTopic(undefined, CurrentLocationTopic)

  useLayoutEffect(() => {
    navigateRef.current = navigate
  })

  useLayoutEffect(() => installHistorySyncMarker(), [])

  const finishTopicNavigation = () => {
    if (topicNavigation.current) clearTimeout(topicNavigation.current.timeout)
    topicNavigation.current = null
  }

  const flushPendingTopicUrl = () => {
    const pending = pendingTopicUrlRef.current
    pendingTopicUrlRef.current = null
    if (pending !== null && normalizeUrl(pending) !== normalizeUrl(routerUrlRef.current)) {
      startTopicNavigation(pending)
    }
  }

  const startTopicNavigation = (topicUrl: string) => {
    finishTopicNavigation()
    const timeout = setTimeout(() => {
      // Bounded guard: a navigation that never commits must not park later shell events.
      topicNavigation.current = null
      flushPendingTopicUrl()
    }, TOPIC_NAVIGATION_TIMEOUT_MS)
    topicNavigation.current = { target: normalizeUrl(topicUrl), locationKey: locationKeyRef.current, timeout }
    navigateRef.current(topicUrl, { replace: true, state: { [SHELL_SYNC_MARKER]: true } })
  }

  useEffect(() => finishTopicNavigation, [])

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

      const target = normalizeUrl(topicUrl)
      const now = Date.now()
      ownPublishedUrlsRef.current = ownPublishedUrlsRef.current.filter((p) => now - p.publishedAt < OWN_PUBLISH_TTL_MS)
      const ownPublishIndex = ownPublishedUrlsRef.current.findIndex((p) => normalizeUrl(p.url) === target)
      if (ownPublishIndex !== -1) {
        // Topic delivers our own publishes back asynchronously. Drop the echo and
        // anything published before it, otherwise it would revert newer navigation.
        ownPublishedUrlsRef.current.splice(0, ownPublishIndex + 1)
        return
      }
      // The initial replay represents the shell's current location and should
      // not overwrite the browser URL with a potentially stale value.
      if (location.isFirst) {
        return
      }
      if (topicNavigation.current) {
        // Keep only the latest shell intent. Returning to the in-flight target
        // cancels a previously queued destination (A -> B -> A ends on A).
        pendingTopicUrlRef.current = target === topicNavigation.current.target ? null : topicUrl
        return
      }
      if (normalizeUrl(routerUrlRef.current) !== target) {
        startTopicNavigation(topicUrl)
      }
    })

    return () => {
      locationSubscription.unsubscribe()
    }
  }, [currentLocation$])

  // Publish internal navigation changes so the shell can update the browser URL.
  // A topic-driven navigation is not published back; it is settled once React Router
  // commits a new location (tracked by location key, so a navigation that ends on the
  // same URL, or on a normalized form of it, still releases the guard).
  // useLayoutEffect runs synchronously after DOM mutations so there is no
  // extra render between the URL change and the publish.
  useLayoutEffect(() => {
    routerUrlRef.current = routerUrl
    locationKeyRef.current = locationHook.key
    if (locationHook.pathname !== currentLocation.url) {
      setCurrentLocation({ url: locationHook.pathname, isFirst: false })
    }

    const inFlight = topicNavigation.current
    if (inFlight) {
      if (locationHook.key === inFlight.locationKey) {
        return
      }
      finishTopicNavigation()
      if (normalizeUrl(routerUrl) === inFlight.target) {
        lastPublishedUrlRef.current = routerUrl
        flushPendingTopicUrl()
        return
      }
      if (pendingTopicUrlRef.current !== null) {
        flushPendingTopicUrl()
        return
      }
      // A competing navigation (not the shell target) committed: publish it below.
    }

    if (routerUrl !== lastPublishedUrlRef.current) {
      lastPublishedUrlRef.current = routerUrl
      const ownPublish: OwnPublish = { url: routerUrl, publishedAt: Date.now() }
      ownPublishedUrlsRef.current.push(ownPublish)
      if (ownPublishedUrlsRef.current.length > MAX_OWN_PUBLISHED_URLS) {
        ownPublishedUrlsRef.current.shift()
      }
      currentLocation$
        .publish({
          url: routerUrl,
          isFirst: false,
        })
        .catch((err) => {
          ownPublishedUrlsRef.current = ownPublishedUrlsRef.current.filter((p) => p !== ownPublish)
          logger.error('publish failed:', err)
        })
    }
  }, [routerUrl, locationHook.key, currentLocation.url, currentLocation$])

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
