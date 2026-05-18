import { registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'
import { Remote } from '@module-federation/runtime-core/types'
import { RemoteComponent } from '@onecx/integration-interface'

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
    name: r.productName + '|' + r.appId,
    shareScope,
  }
}

export function getFederationInstance() {
  return (globalThis as any)['onecxFederationInstance'] ?? undefined
}

export async function registerAndLoadRemote<T>(remoteConfig: Remote, exposedModule: string): Promise<T | undefined> {
  const sanitizedModule = exposedModule.startsWith('./') ? exposedModule.slice(2) : exposedModule
  const instance = getFederationInstance()
  if(instance) {
    instance.registerRemotes([remoteConfig])
    return instance.loadRemote(remoteConfig.name + '/' + sanitizedModule) as Promise<T> | undefined
  }
  registerRemotes([remoteConfig])
  return loadRemote(remoteConfig.name + '/' + sanitizedModule) as Promise<T> | undefined
}
