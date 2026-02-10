import { Capability } from '@onecx/angular-integration-interface'

/**
 * Registers shell capabilities globally for the host application.
 *
 * @param capabilities - List of capabilities provided by the host shell.
 */
const setCapabilities = (capabilities: Capability[]): void => {
  ;(globalThis as any)['onecx-shell-capabilities'] = capabilities
}

/**
 * Hook to check if the host application provides a capability.
 *
 * @returns Helper for capability checks.
 */
const useShellCapability = () => {
  const hasCapability = (capability: Capability): boolean => {
    return (globalThis as any)['onecx-shell-capabilities']?.includes(capability) ?? false
  }

  return {
    hasCapability,
  }
}

export { useShellCapability, setCapabilities }
