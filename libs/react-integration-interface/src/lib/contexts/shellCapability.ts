import { ShellCapability, hasShellCapability, setShellCapabilities } from '@onecx/integration-interface'

/**
 * Registers shell capabilities globally for the host application.
 *
 * @param capabilities - List of capabilities provided by the host shell.
 */
const setCapabilities = (capabilities: ShellCapability[]): void => {
  setShellCapabilities(capabilities)
}

const hasCapability = (capability: ShellCapability): boolean => {
  return hasShellCapability(capability)
}

/**
 * Hook to check if the host application provides a capability.
 *
 * @returns Helper for capability checks.
 */
const useShellCapability = () => {
  return {
    hasCapability,
  }
}

export { useShellCapability, setCapabilities }
