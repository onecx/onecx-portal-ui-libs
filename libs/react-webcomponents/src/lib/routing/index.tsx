import { createContext, type FC, type PropsWithChildren, type ReactNode, useEffect, useState } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router'
import { CurrentLocationTopic, type CurrentLocationTopicPayload } from '@onecx/integration-interface'

export { withSyncedRouter } from './hoc'
export { useSyncedLocation } from './useSyncedLocation'

const initValue = {
  url: '',
  isFirst: true,
}

export const SyncedLocationContext = createContext<CurrentLocationTopicPayload>(initValue)

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

export const SyncedRouterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <RouterSync>{children}</RouterSync>
    </BrowserRouter>
  )
}
