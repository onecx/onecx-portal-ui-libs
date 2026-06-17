import { useShellCapability, setCapabilities } from './shellCapability'
import { ShellCapability, hasShellCapability, setShellCapabilities } from '@onecx/integration-interface'
import { renderHook } from '@testing-library/react'

jest.mock('@onecx/integration-interface', () => ({
  ShellCapability: {
    CURRENT_LOCATION_TOPIC: 'currentLocationTopic',
    PARAMETERS_TOPIC: 'parametersTopic',
    ACTIVENESS_AWARE_MENUS: 'activenessAwareMenus',
    DYNAMIC_TRANSLATIONS_TOPIC: 'dynamicTranslationsTopic',
  },
  hasShellCapability: jest.fn(),
  setShellCapabilities: jest.fn(),
}))

describe('shellCapability', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setCapabilities', () => {
    it('delegates to setShellCapabilities', () => {
      const caps = [ShellCapability.PARAMETERS_TOPIC]
      setCapabilities(caps)
      expect(setShellCapabilities).toHaveBeenCalledWith(caps)
    })
  })

  describe('useShellCapability', () => {
    it('returns hasCapability function', () => {
      const { result } = renderHook(() => useShellCapability())
      expect(result.current.hasCapability).toBeInstanceOf(Function)
    })

    it('hasCapability delegates to hasShellCapability', () => {
      ;(hasShellCapability as jest.Mock).mockReturnValue(true)
      const { result } = renderHook(() => useShellCapability())

      const hasIt = result.current.hasCapability(ShellCapability.PARAMETERS_TOPIC)
      expect(hasIt).toBe(true)
      expect(hasShellCapability).toHaveBeenCalledWith(ShellCapability.PARAMETERS_TOPIC)
    })
  })
})
