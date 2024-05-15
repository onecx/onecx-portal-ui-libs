import { Topic } from '@onecx/accelerator'
import { RemoteComponentsInfo } from './remote-components-info.model'

export class RemoteComponentsTopic extends Topic<RemoteComponentsInfo> {
  constructor() {
    super('remoteComponentsInfo', 1)
  }
}
