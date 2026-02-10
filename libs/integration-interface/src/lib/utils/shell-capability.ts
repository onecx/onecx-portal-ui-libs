const SHELL_CAPABILITIES_KEY = 'onecx-shell-capabilities'

/**
 * Supported shell capability flags.
 */
export enum Capability {
  CURRENT_LOCATION_TOPIC = 'currentLocationTopic',
  PARAMETERS_TOPIC = 'parametersTopic',
  ACTIVENESS_AWARE_MENUS = 'activenessAwareMenus',
}

/**
 * Registers shell capabilities globally for the host application.
 *
 * @param capabilities - List of capabilities provided by the host shell.
 */
const setShellCapabilities = (capabilities: Capability[]): void => {
  ;(globalThis as typeof globalThis & { [SHELL_CAPABILITIES_KEY]?: Capability[] })[SHELL_CAPABILITIES_KEY] = capabilities
}

/**
 * Returns currently registered shell capabilities.
 *
 * @returns Capability list or undefined.
 */
const getShellCapabilities = (): Capability[] | undefined => {
  return (globalThis as typeof globalThis & { [SHELL_CAPABILITIES_KEY]?: Capability[] })[SHELL_CAPABILITIES_KEY]
}

/**
 * Checks if the host application provides a capability.
 *
 * @param capability - Capability to verify.
 * @returns True if capability is present.
 */
const hasShellCapability = (capability: Capability): boolean => {
  return getShellCapabilities()?.includes(capability) ?? false
}

export { getShellCapabilities, hasShellCapability, setShellCapabilities }
