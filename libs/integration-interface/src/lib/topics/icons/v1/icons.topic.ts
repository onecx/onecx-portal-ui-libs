import { Topic } from '@onecx/accelerator'
import { IconLoaderMessage } from './icons.model'

export class IconLoaderTopic extends Topic<IconLoaderMessage> {
  constructor() {
    super('onecx-icon-service', 1, false)
  }
}

