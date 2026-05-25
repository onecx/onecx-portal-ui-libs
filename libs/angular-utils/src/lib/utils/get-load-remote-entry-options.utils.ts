import { getInstance } from '@module-federation/enhanced/runtime'
import type { ModuleFederation, types } from '@module-federation/runtime-core'
import { RemoteComponent } from '@onecx/integration-interface'

type Remote = types.Remote

// This type is a copy of the actual Technologies used in onecx-shell-ui.
export enum Technologies {
  Angular = 'Angular',
  WebComponent = 'WebComponent',
  WebComponentScript = 'WebComponentScript',
  WebComponentModule = 'WebComponentModule',
}

// This type is a subset of the actual BffGeneratedRoute used in onecx-shell-ui, containing only the properties relevant for registering a remote entry.
type BffGeneratedRoute = {
  remoteEntryUrl: string
  productName: string
  appId: string
  technology?: Technologies
  baseUrl: string
  shareScope?: string
  remoteName?: string
}

type RemoteEntry = BffGeneratedRoute | RemoteComponent

export function createRemoteConfig(
  entry: string,
  name: string,
  type: 'module' | 'script' = 'module',
  shareScope = 'default'
): Remote {
  return { type, entry, name, shareScope }
}

export async function toLoadRemoteEntryOptions(r: RemoteEntry): Promise<Remote> {
  const shareScope = r.shareScope ?? 'default'
  const type = r.technology === Technologies.Angular || r.technology === Technologies.WebComponentModule
    ? 'module'
    : 'script'
  
  return {
    type,
    entry: r.remoteEntryUrl,
    name: getRemoteName(r),
    shareScope,
  }
}

function getRemoteName(r: RemoteEntry): string {
  if (r.technology === Technologies.WebComponentScript && r.remoteName) {
    // For WebComponentScript, we have to use the remoteName equal to the name defined in the module federation configuration of the remote application, since it doesn't follow the module format and we need to access the exposed component via the global variable defined in the remote entry.
    return r.remoteName
  }

  return r.productName + '|' + r.appId
}

export function getShellMfInstance(): ModuleFederation | null {
  return (globalThis as any)['onecxFederationInstance'] ?? getInstance((instance: ModuleFederation) => instance.name === 'onecx-shell-ui')
}

export async function registerAndLoadRemote<T>(instance: ModuleFederation, remoteConfig: Remote, exposedModule: string): Promise<T | undefined> {
  const sanitizedModule = exposedModule.startsWith('./') ? exposedModule.slice(2) : exposedModule
  instance.registerRemotes([remoteConfig])
  return instance.loadRemote(remoteConfig.name + '/' + sanitizedModule) as Promise<T> | undefined
}