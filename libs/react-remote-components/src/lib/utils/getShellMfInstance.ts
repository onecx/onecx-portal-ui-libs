import { ModuleFederation } from '@module-federation/runtime-core'

export const getShellMfInstance = (): ModuleFederation | undefined => {
  return globalThis.__FEDERATION__.__INSTANCES__.find((instance) => instance.name === 'onecx-shell-ui')
}
