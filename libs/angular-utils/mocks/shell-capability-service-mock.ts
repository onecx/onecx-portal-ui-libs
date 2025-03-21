import { Capability, ShellCapabilityService } from '@onecx/angular-utils'

export function provideShellCapabilityServiceMock() {
  return [ShellCapabilityServiceMock, { provide: ShellCapabilityService, useExisting: ShellCapabilityServiceMock }]
}

export class ShellCapabilityServiceMock {
  static capabilities: Capability[] = []

  static setCapabilities(capabilities: Capability[]): void {
    ShellCapabilityServiceMock.capabilities = capabilities
  }

  hasCapability(capability: Capability): boolean {
    return ShellCapabilityServiceMock.capabilities?.includes(capability) ?? false
  }
}
