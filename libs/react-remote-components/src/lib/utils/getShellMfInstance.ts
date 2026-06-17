import type { ModuleFederation } from '@module-federation/runtime-core'

export const getShellMfInstance = (): ModuleFederation | undefined => {
  const instances = globalThis.__FEDERATION__?.__INSTANCES__
  if (!Array.isArray(instances)) {
    return undefined
  }
  return instances.find((instance) => instance.name === 'onecx-shell-ui' || instance.name === 'onecx_shell_ui')
}
