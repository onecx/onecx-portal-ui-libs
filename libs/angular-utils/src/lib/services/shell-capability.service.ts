import { Injectable } from '@angular/core'

declare global {
  interface Window {
    'onecx-shell-capabilities': Capability[]
  }
}

export enum Capability {
    CURRENT_LOCATION_TOPIC = 'currentLocationTopic',
}

@Injectable()
export class ShellCapabilityService {
  static setCapabilities(capabilities: Capability[]): void {
    window['onecx-shell-capabilities'] = capabilities
  }

  hasCapability(capability: Capability): boolean {
    return window['onecx-shell-capabilities']?.includes(capability) ?? false
  }
}
