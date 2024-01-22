import { SyncableTopic } from '@onecx/accelerator'
import { Portal } from './portal.model'

export class CurrentPortalTopic extends SyncableTopic<Portal> {
  constructor() {
    super('currentPortal', 1)
  }
}
