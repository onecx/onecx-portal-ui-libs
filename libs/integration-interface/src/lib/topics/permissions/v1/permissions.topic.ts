import { SyncableTopic } from '@onecx/accelerator'
import { Permissions } from './permissions.model'

export class PermissionsTopic extends SyncableTopic<Permissions> {
  constructor() {
    super('permissions', 1)
  }
}
