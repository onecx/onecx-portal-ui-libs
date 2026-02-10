import { createContext, type FC, type PropsWithChildren, type ReactNode, useEffect, useState } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router'
import { CurrentLocationTopic, type CurrentLocationTopicPayload } from '@onecx/integration-interface'

const initValue = {
  url: '',
  isFirst: true,
}

/**
 * Context holding the current synced location payload.
 *
 * @returns CurrentLocationTopicPayload via context.
 */
export const SyncedLocationContext = createContext<CurrentLocationTopicPayload>(initValue)

/**
 * Internal component syncing router state with the current location topic.
 *
 * @param children - React subtree rendered within the sync layer.
 * @returns Synced router context provider.
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
      if (locationHook.pathname !== location.url) {
        setCurrentLocation(() => {
          locationHook.pathname = location.url ?? locationHook.pathname
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

  return <SyncedLocationContext value={currentLocation}>{children}</SyncedLocationContext>
}

/**
 * Provides a browser router that stays in sync with portal location events.
 *
 * @param children - React subtree rendered inside the router.
 * @returns Browser router provider with location sync.
 */
export const SyncedRouterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <RouterSync>{children}</RouterSync>
    </BrowserRouter>
  )
}
