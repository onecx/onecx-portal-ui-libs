import type { ComponentType, FC } from 'react'
import { SlotProvider } from '../contexts/slotContext'
import { PermissionProvider } from '../contexts/permissionContext'

/**
 * Wrap a component with Slot and Permission providers for remote components.
 * @param WrappedComponent - component to wrap with providers.
 * @returns component wrapped with SlotProvider and PermissionProvider.
 */
export const withSlot = <P extends object>(WrappedComponent: ComponentType<P>): FC<P> => {
  const hocComponent = (props: P) => (
    <PermissionProvider>
      <SlotProvider>
        <WrappedComponent {...props} />
      </SlotProvider>
    </PermissionProvider>
  )

  return hocComponent
}
