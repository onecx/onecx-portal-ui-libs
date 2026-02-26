import { ShellCapability } from '../models/shell-capability.model';

export function hasShellCapability(capability: ShellCapability): boolean {
  return window['onecx-shell-capabilities']?.includes(capability) ?? false;
}
