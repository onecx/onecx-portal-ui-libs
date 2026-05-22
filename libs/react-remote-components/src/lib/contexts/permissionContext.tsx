import { type FC, createContext, useState, useEffect, useMemo, type PropsWithChildren } from 'react'
import { filter, firstValueFrom, map } from 'rxjs'
import { type PermissionsRpc, PermissionsRpcTopic } from '@onecx/integration-interface'

/**
 * Permission context value shape.
 */
interface PermissionContextType {
  permissions: PermissionsRpc[]
  getPermissions: (appId: string, productName: string) => Promise<string[]>
}

/** Permission context for remote components. */
export const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

const permissionsTopic$ = new PermissionsRpcTopic()

/**
 * Provides permissions fetched from the portal permissions topic.
 * @param children - nested content rendered with permission context.
 * @returns Permission context provider component.
 */
export const PermissionProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [permissions, setPermissions] = useState<PermissionsRpc[]>([])

  /**
   * Fetch permissions for a given app/product pair.
   * @param appId - application identifier.
   * @param productName - product identifier.
   * @returns list of permissions.
   */
  const getPermissions = async (appId: string, productName: string): Promise<string[]> => {
    const permissions = firstValueFrom(
      permissionsTopic$.pipe(
        filter(
          (message) =>
            message.appId === appId && message.productName === productName && Array.isArray(message.permissions)
        ),
        map((message) => message.permissions ?? [])
      )
    )
    permissionsTopic$.publish({ appId: appId, productName: productName })
    return permissions
  }

  useEffect(() => {
    const subscription = permissionsTopic$.subscribe((message) => {
      setPermissions((prev) => [...prev, message])
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const contextValue = useMemo(() => ({ permissions, getPermissions }), [permissions])

  return <PermissionContext.Provider value={contextValue}>{children}</PermissionContext.Provider>
}
