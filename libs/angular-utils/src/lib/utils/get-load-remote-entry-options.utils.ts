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

export async function toLoadRemoteEntryOptions(r: RemoteEntry): Promise<Remote> {
  const shareScope = r.shareScope ?? 'default'
  return {
    type: getRemoteType(r),
    entry: r.remoteEntryUrl,
    name: r.productName + '|' + r.appId,
    shareScope,
  }
}

function getRemoteType(r: RemoteEntry): 'module' | 'script' {
  if (r.technology === Technologies.Angular || r.technology === Technologies.WebComponentModule) {
    return 'module'
  }
  return 'script'
}
