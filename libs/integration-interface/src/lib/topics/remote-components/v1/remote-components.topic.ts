import { Topic } from '@onecx/accelerator'
import { RemoteComponentsInfo } from './remote-component.model'

export class RemoteComponentsTopic extends Topic<RemoteComponentsInfo> {
  constructor() {
    super('remoteComponentsInfo', 1)
  }
}
