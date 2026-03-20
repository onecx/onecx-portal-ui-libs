import { Injectable } from '@angular/core'
import { ShellCapability, hasShellCapability, setShellCapabilities } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class ShellCapabilityService {
  static setCapabilities(capabilities: ShellCapability[]): void {
    setShellCapabilities(capabilities)
  }

  hasCapability(capability: ShellCapability): boolean {
    return hasShellCapability(capability)
  }
}
export { ShellCapability as Capability } from '@onecx/integration-interface'
