import { Injectable } from '@angular/core';
import { ShellCapability } from '@onecx/integration-interface';

@Injectable({ providedIn: 'root' })
export class ShellCapabilityService {
  static setCapabilities(capabilities: ShellCapability[]): void {
    window['onecx-shell-capabilities'] = capabilities;
  }

  hasCapability(capability: ShellCapability): boolean {
    return window['onecx-shell-capabilities']?.includes(capability) ?? false;
  }
}

export { ShellCapability as Capability } from '@onecx/integration-interface';

