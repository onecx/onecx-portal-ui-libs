import { useContext } from 'react'
import { PermissionContext } from '../contexts/permissionContext'

/**
 * Hook to access permission context.
 * @returns Permission context value.
 * @throws Error when used outside PermissionProvider.
 */
export const usePermission = () => {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }
  return context
}
