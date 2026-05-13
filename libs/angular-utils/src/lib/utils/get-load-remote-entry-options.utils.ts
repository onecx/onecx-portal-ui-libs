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
  remoteName?: string
}

type RemoteEntry = BffGeneratedRoute | RemoteComponent

export async function toLoadRemoteEntryOptions(r: RemoteEntry): Promise<Remote> {
  const shareScope = r.shareScope ?? 'default'
  return {
    type: getRemoteType(r),
    entry: r.remoteEntryUrl,
    name: getRemoteName(r),
    shareScope,
  }
}

function getRemoteType(r: RemoteEntry): 'module' | 'script' {
  if (r.technology === Technologies.Angular || r.technology === Technologies.WebComponentModule) {
    return 'module'
  }
  // For WebComponentScript, we need to load the remote entry as a script, since it doesn't follow the module format.
  return 'script'
}

function getRemoteName(r: RemoteEntry): string {
  if (r.technology === Technologies.WebComponentScript && r.remoteName) {
    // For WebComponentScript, we have to use the remoteName equal to the name defined in the module federation configuration of the remote application, since it doesn't follow the module format and we need to access the exposed component via the global variable defined in the remote entry.
    return r.remoteName
  }

  return r.productName + '|' + r.appId
}
