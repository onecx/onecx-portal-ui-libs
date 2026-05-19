import { ShellCapability } from '../models/shell-capability.model'

const SHELL_CAPABILITIES_KEY = 'onecx-shell-capabilities'

/**
 * Registers shell capabilities globally for the host application.
 *
 * @param capabilities - List of capabilities provided by the host shell.
 */
const setShellCapabilities = (capabilities: ShellCapability[]): void => {
  ;(globalThis as typeof globalThis & { [SHELL_CAPABILITIES_KEY]?: ShellCapability[] })[SHELL_CAPABILITIES_KEY] =
    capabilities
}

/**
 * Returns currently registered shell capabilities.
 *
 * @returns Capability list or undefined.
 */
const getShellCapabilities = (): ShellCapability[] | undefined => {
  return (globalThis as typeof globalThis & { [SHELL_CAPABILITIES_KEY]?: ShellCapability[] })[SHELL_CAPABILITIES_KEY]
}

/**
 * Checks if the host application provides a capability.
 *
 * @param capability - Capability to verify.
 * @returns True if capability is present.
 */
const hasShellCapability = (capability: ShellCapability): boolean => {
  return getShellCapabilities()?.includes(capability) ?? false
}

export { getShellCapabilities, hasShellCapability, setShellCapabilities }
