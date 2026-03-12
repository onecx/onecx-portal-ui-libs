import { Location } from '@angular/common'
import { getShareScope } from './get-share-scope.utils'
import { Remote } from '@module-federation/runtime-core/types'
import { RemoteComponent } from '@onecx/integration-interface'

enum Technologies {
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
  technology: Technologies
  baseUrl: string
  shareScope?: string
}

type RemoteEntry = BffGeneratedRoute | RemoteComponent

export async function toLoadRemoteEntryOptions(r: RemoteEntry): Promise<Remote> {
  let shareScope = 'default'
  if (r.shareScope) {
    shareScope = r.shareScope
  } else {
    const manifestUrl = Location.joinWithSlash(r.baseUrl, 'mf-manifest.json')
    shareScope = await getShareScope(manifestUrl)
  }
  // TODO: Check if this works for script type (Angular 12 or below)
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
