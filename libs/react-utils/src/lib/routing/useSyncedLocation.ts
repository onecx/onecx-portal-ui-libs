import { useContext } from 'react'
import { SyncedLocationContext } from '.'

/**
 * Hook to access the synced location payload.
 * Must be used within SyncedRouterProvider.
 *
 * @returns Current location payload from the synced router.
 * @throws Error when used outside SyncedRouterProvider.
 */
export const useSyncedLocation = () => {
  const context = useContext(SyncedLocationContext)

  if (context === undefined) {
    throw new Error(
      'useSyncedLocation must be used within a SyncedLocationProvider, you probably are not using "withApp" hoc in your app file'
    )
  }

  return context
}
