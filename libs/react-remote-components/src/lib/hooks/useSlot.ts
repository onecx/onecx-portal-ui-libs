import { useContext } from 'react'
import { SlotContext } from '../contexts/slotContext'
import type { SlotServiceInterface } from '../models'

/**
 * Hook to access slot services.
 * @returns Slot service interface.
 * @throws Error when used outside SlotProvider.
 */
export const useSlot = (): SlotServiceInterface => {
  const context = useContext(SlotContext)

  if (!context) {
    throw new Error('useSlot must be used within a SlotProvider')
  }
  return context
}
