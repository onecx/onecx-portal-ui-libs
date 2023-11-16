import { Topic } from '@onecx/accelerator'

export class GlobalLoadingTopic extends Topic<boolean> {
  constructor() {
    super('globalLoading', 1)
  }
}
