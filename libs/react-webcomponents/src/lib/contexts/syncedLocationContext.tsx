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

/**
 * React context carrying the current synced location payload.
 */
export const SyncedLocationContext = createContext<CurrentLocationTopicPayload | undefined>(undefined)

/**
 * Internal router sync component subscribing to current location topic.
 * @param children - nested content rendered with synced location context.
 * @returns Provider for synced location state.
 */
const toUrl = ({ pathname, search, hash }: { pathname: string; search: string; hash: string }) =>
  `${pathname}${search}${hash}`

const RouterSync: FC<PropsWithChildren> = ({ children }) => {
  const locationHook = useLocation()
  const navigate = useNavigate()
  const routerUrl = toUrl(locationHook)
  const [currentLocation, setCurrentLocation] = useState<CurrentLocationTopicPayload>({
    url: routerUrl,
    isFirst: false,
  })
  const routerUrlRef = useRef(routerUrl)
  const pendingUrlRef = useRef<string | null>(null)
  const currentLocation$ = useTopic(undefined, CurrentLocationTopic)

  useEffect(() => {
    const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/'
    const normalizedBaseHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`

    const locationSubscription = currentLocation$.subscribe((location) => {
      const topicUrl = location.url
      if (topicUrl === undefined) {
        return
      }
      if (topicUrl !== '/' && topicUrl !== '' && !topicUrl.startsWith(normalizedBaseHref)) {
        return
      }

      const targetUrl = topicUrl || '/'
      if (routerUrlRef.current === targetUrl || pendingUrlRef.current === targetUrl) {
        return
      }
      pendingUrlRef.current = targetUrl
      setCurrentLocation({ url: targetUrl, isFirst: location.isFirst })
      navigate(targetUrl, { replace: true })
    })

    return () => {
      locationSubscription.unsubscribe()
    }
  }, [currentLocation$, navigate])

  useLayoutEffect(() => {
    routerUrlRef.current = routerUrl
    if (pendingUrlRef.current === routerUrl) {
      pendingUrlRef.current = null
    }
    if (routerUrl !== currentLocation.url) {
      setCurrentLocation({ url: routerUrl, isFirst: false })
    }
  }, [routerUrl, currentLocation.url])

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
