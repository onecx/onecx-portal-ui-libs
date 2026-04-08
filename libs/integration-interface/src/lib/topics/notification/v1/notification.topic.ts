import { SyncableTopic } from '@onecx/accelerator'
import { Notification } from './notification.model'

export class NotificationTopic extends SyncableTopic<Notification> {
  constructor() {
    super('notification', 1)
  }
}
