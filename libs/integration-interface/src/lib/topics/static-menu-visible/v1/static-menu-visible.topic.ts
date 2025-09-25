import { Topic } from '@onecx/accelerator'

export class StaticMenuVisibleTopic extends Topic<{ isVisible: boolean }> {
  constructor() {
    super('staticMenuVisible', 1)
  }
}
