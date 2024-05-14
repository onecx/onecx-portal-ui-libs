import { SyncableTopic } from '@onecx/accelerator'
import { PermissionsRpc } from './permissions-rpc.model'

export class PermissionsRpcTopic extends SyncableTopic<PermissionsRpc> {
  constructor() {
    super('permissionsRpc', 1)
  }
}
