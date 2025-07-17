import { Topic } from '@onecx/accelerator'
import { Workspace } from './workspace.model'

export class CurrentWorkspaceTopic extends Topic<Workspace> {
  constructor() {
    super('currentPortal', 1)
  }
}
