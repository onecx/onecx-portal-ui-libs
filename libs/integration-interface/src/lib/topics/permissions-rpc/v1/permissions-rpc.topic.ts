import { Topic } from '@onecx/accelerator'
import { PermissionsRpc } from './permissions-rpc.model'

export class PermissionsRpcTopic extends Topic<PermissionsRpc> {
  constructor() {
    super('permissionsRpc', 1, false)
  }
}
