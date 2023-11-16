import { Topic } from '@onecx/accelerator'

export class GlobalErrorTopic extends Topic<string> {
  constructor() {
    super('globalError', 1)
  }
}
