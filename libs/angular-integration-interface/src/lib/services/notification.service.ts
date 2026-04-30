import { Injectable, OnDestroy } from '@angular/core'
import { NotificationService as NotificationServiceFromIntegrationInterface, NotificationTopic } from '@onecx/integration-interface'


@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {

  private readonly notificationService = new NotificationServiceFromIntegrationInterface()

  get notificationTopic(): NotificationTopic {
    return this.notificationService.notificationTopic;
  }

  ngOnDestroy(): void {
    this.notificationService.destroy();
  }

}
