import { Capability } from '@onecx/angular-utils'

export class ShellCapabilityServiceMock {
  static capabilities: Capability[] = []

  static setCapabilities(capabilities: Capability[]): void {
    ShellCapabilityServiceMock.capabilities = capabilities
  }

  hasCapability(capability: Capability): boolean {
    return ShellCapabilityServiceMock.capabilities?.includes(capability) ?? false
  }
}
