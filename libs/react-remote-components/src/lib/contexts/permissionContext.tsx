import { type FC, createContext, useMemo, type PropsWithChildren } from 'react'
import { filter, firstValueFrom, map } from 'rxjs'
import { PermissionsRpcTopic } from '@onecx/integration-interface'
import { useTopic } from '@onecx/react-integration-interface'

/**
 * Permission context value shape.
 */
interface PermissionContextType {
  getPermissions: (appId: string, productName: string) => Promise<string[]>
}

/** Permission context for remote components. */
export const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

/**
 * Provides permissions fetched from the portal permissions topic.
 * Mirrors the Angular `PermissionService` pattern: caches results by `appId:productName`
 * and does not accumulate messages in state, preventing re-render loops.
 *
 * @param children - nested content rendered with permission context.
 * @returns Permission context provider component.
 */
export const PermissionProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const permissionCache = useMemo(() => new Map<string, Promise<string[]>>(), [])
  const topic$ = useTopic(undefined, PermissionsRpcTopic)

  const getPermissions = async (appId: string, productName: string): Promise<string[]> => {
    const cacheKey = `${appId}:${productName}`
    const cached = permissionCache.get(cacheKey)
    if (cached) return cached

    const permissions = firstValueFrom(
      topic$.pipe(
        filter(
          (message) =>
            message.appId === appId && message.productName === productName && Array.isArray(message.permissions)
        ),
        map((message) => message.permissions ?? [])
      )
    )
    permissionCache.set(cacheKey, permissions)
    topic$.publish({ appId, productName })
    return permissions
  }

  const contextValue = useMemo(() => ({ getPermissions }), [permissionCache, topic$])

  return <PermissionContext.Provider value={contextValue}>{children}</PermissionContext.Provider>
}
