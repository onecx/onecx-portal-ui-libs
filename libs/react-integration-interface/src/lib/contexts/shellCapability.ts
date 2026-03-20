import { Capability, hasShellCapability, setShellCapabilities } from '@onecx/integration-interface'

/**
 * Registers shell capabilities globally for the host application.
 *
 * @param capabilities - List of capabilities provided by the host shell.
 */
const setCapabilities = (capabilities: Capability[]): void => {
  setShellCapabilities(capabilities)
}

/**
 * Hook to check if the host application provides a capability.
 *
 * @returns Helper for capability checks.
 */
const useShellCapability = () => {
  const hasCapability = (capability: Capability): boolean => {
    return hasShellCapability(capability)
  }

  return {
    hasCapability,
  }
}

export { useShellCapability, setCapabilities }
