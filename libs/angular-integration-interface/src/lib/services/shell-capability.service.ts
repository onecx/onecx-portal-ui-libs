import { Injectable } from '@angular/core'

declare global {
  interface Window {
    'onecx-shell-capabilities': Capability[]
  }
}

export enum Capability {
  CURRENT_LOCATION_TOPIC = 'currentLocationTopic',
  PARAMETERS_TOPIC = 'parametersTopic',
  ACTIVENESS_AWARE_MENUS = 'activenessAwareMenus',
}

@Injectable({ providedIn: 'root' })
export class ShellCapabilityService {
  static setCapabilities(capabilities: Capability[]): void {
    window['onecx-shell-capabilities'] = capabilities
  }

  hasCapability(capability: Capability): boolean {
    return window['onecx-shell-capabilities']?.includes(capability) ?? false
  }
}
