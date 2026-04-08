import { Topic } from '@onecx/accelerator'
import { Notification } from './notification.model'

export class NotificationTopic extends Topic<Notification> {
  constructor() {
    super('notification', 1)
  }
}
