import { SyncableTopic } from '@onecx/accelerator'
import { Workspace } from './workspace.model'

export class CurrentWorkspaceTopic extends SyncableTopic<Workspace> {
  constructor() {
    super('currentPortal', 1)
  }
}
