import { Topic } from '@onecx/accelerator'
import { Icon } from './icon.model'

export class IconTopic extends Topic<Icon> {
  constructor() {
    super('icon', 1, false)
  }
}

