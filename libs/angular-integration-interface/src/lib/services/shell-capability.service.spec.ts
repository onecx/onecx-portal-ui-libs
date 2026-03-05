import { ShellCapabilityService, Capability } from './shell-capability.service'
import { ShellCapability } from '@onecx/integration-interface'

describe('ShellCapabilityService', () => {
  let service: ShellCapabilityService

  beforeEach(() => {
    service = new ShellCapabilityService()
    delete (window as any)['onecx-shell-capabilities']
  })

  it('should write capabilities to window using static setter', () => {
    ShellCapabilityService.setCapabilities([ShellCapability.PARAMETERS_TOPIC])

    expect((window as any)['onecx-shell-capabilities']).toEqual([ShellCapability.PARAMETERS_TOPIC])
  })

  it('should return true when capability is present', () => {
    ShellCapabilityService.setCapabilities([ShellCapability.PARAMETERS_TOPIC, ShellCapability.DYNAMIC_TRANSLATIONS_TOPIC])

    expect(service.hasCapability(ShellCapability.DYNAMIC_TRANSLATIONS_TOPIC)).toBe(true)
  })

  it('should return false when capability is missing', () => {
    ShellCapabilityService.setCapabilities([ShellCapability.PARAMETERS_TOPIC])

    expect(service.hasCapability(ShellCapability.DYNAMIC_TRANSLATIONS_TOPIC)).toBe(false)
  })

  it('should return false when capabilities were not initialized', () => {
    expect(service.hasCapability(ShellCapability.PARAMETERS_TOPIC)).toBe(false)
  })

  it('should expose Capability alias', () => {
    expect(Capability).toBe(ShellCapability)
  })
})
