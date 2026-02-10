import { Injectable } from '@angular/core'
import { Capability, hasShellCapability, setShellCapabilities } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class ShellCapabilityService {
  static setCapabilities(capabilities: Capability[]): void {
    setShellCapabilities(capabilities)
  }

  hasCapability(capability: Capability): boolean {
    return hasShellCapability(capability)
  }
}
