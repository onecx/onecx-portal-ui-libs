import { Capability } from '@onecx/angular-integration-interface'

/**
 * Registers shell capabilities globally for the host application.
 */
const setCapabilities = (capabilities: Capability[]): void => {
  ;(globalThis as any)['onecx-shell-capabilities'] = capabilities
}

/**
 * Hook to check if the host application provides a capability.
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
