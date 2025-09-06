import { Injectable } from '@angular/core'

declare global {
  interface Window {
    'onecx-shell-capabilities': Capability[]
  }
}

export enum Capability {
  CURRENT_LOCATION_TOPIC = 'currentLocationTopic',
  PARAMETERS_TOPIC = 'parametersTopic',
  PUBLISH_STATIC_MENU_VISIBILITY = 'publishStaticMenuVisibility',
}

@Injectable({ providedIn: 'root' })
export class ShellCapabilityService {
  static setCapabilities(capabilities: Capability[]): void {
    window['onecx-shell-capabilities'] = capabilities
  }

  static addCapability(capability: Capability): void {
    if (!window['onecx-shell-capabilities']) {
      window['onecx-shell-capabilities'] = []
    }
    if (!window['onecx-shell-capabilities'].includes(capability)) {
      window['onecx-shell-capabilities'].push(capability)
    }
  }

  hasCapability(capability: Capability): boolean {
    return window['onecx-shell-capabilities']?.includes(capability) ?? false
  }
}
