import { type FC, createContext, useContext, useState, useEffect, useMemo, type PropsWithChildren } from 'react'
import { filter, firstValueFrom, map } from 'rxjs'
import { type PermissionsRpc, PermissionsRpcTopic } from '@onecx/integration-interface'

interface PermissionContextType {
  permissions: PermissionsRpc[]
  getPermissions: (appId: string, productName: string) => Promise<string[]>
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

const permissionsTopic$ = new PermissionsRpcTopic()

/**
 * Provides permissions fetched from the portal permissions topic.
 */
export const PermissionProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [permissions, setPermissions] = useState<PermissionsRpc[]>([])

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

  return <PermissionContext value={contextValue}>{children}</PermissionContext>
}

/**
 * Hook to access permission context.
 */
export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }
  return context
}
