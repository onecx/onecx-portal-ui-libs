import { renderHook } from '@testing-library/react'
import { type FC, type PropsWithChildren } from 'react'
import { SlotContext } from '../contexts/slotContext'
import { useSlot } from './useSlot'

const mockSlotService = {
  remoteComponents$: {} as any,
  getComponentsForSlot: jest.fn(),
  isSomeComponentDefinedForSlot: jest.fn(),
  loadComponent: jest.fn(),
}

const SlotProviderWrapper: FC<PropsWithChildren<{}>> = ({ children }) => (
  <SlotContext.Provider value={mockSlotService}>{children}</SlotContext.Provider>
)

describe('useSlot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw when used outside SlotProvider', () => {
    expect(() => renderHook(() => useSlot())).toThrow('useSlot must be used within a SlotProvider')
  })

  it('should return the slot service context value', () => {
    const { result } = renderHook(() => useSlot(), { wrapper: SlotProviderWrapper })
    expect(result.current).toBe(mockSlotService)
  })

  it('should expose getComponentsForSlot', () => {
    const { result } = renderHook(() => useSlot(), { wrapper: SlotProviderWrapper })
    expect(typeof result.current.getComponentsForSlot).toBe('function')
  })

  it('should expose isSomeComponentDefinedForSlot', () => {
    const { result } = renderHook(() => useSlot(), { wrapper: SlotProviderWrapper })
    expect(typeof result.current.isSomeComponentDefinedForSlot).toBe('function')
  })

  it('should expose loadComponent', () => {
    const { result } = renderHook(() => useSlot(), { wrapper: SlotProviderWrapper })
    expect(typeof result.current.loadComponent).toBe('function')
  })
})
