import { Topic } from '@onecx/accelerator'
import { RemoteComponent } from './remote-component.model'

export class RemoteComponentsTopic extends Topic<RemoteComponent[]> {
  constructor() {
    super('remoteComponents', 1)
  }
}
