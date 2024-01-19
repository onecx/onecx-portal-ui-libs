import { Topic } from '@onecx/accelerator'

export class IsAuthenticatedTopic extends Topic<void> {
  constructor() {
    super('isAuthenticated', 1)
  }
}
