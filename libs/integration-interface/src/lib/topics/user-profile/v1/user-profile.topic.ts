import { Topic } from '@onecx/accelerator'
import { UserProfile } from './user-profile.model'

export class UserProfileTopic extends Topic<UserProfile> {
  constructor() {
    super('userProfile', 1)
  }
}
