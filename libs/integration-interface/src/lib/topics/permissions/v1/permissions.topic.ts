import { SyncableTopic } from '@onecx/accelerator'

export class PermissionsTopic extends SyncableTopic<string[]> {
  constructor() {
    super('permissions', 1)
  }
}
