import { Injectable, OnDestroy } from '@angular/core'
import { NotificationTopic } from '@onecx/integration-interface'


@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {

  _currentNotification$: NotificationTopic | undefined
  get currentNotification$() {
    this._currentNotification$ ??= new NotificationTopic()
    return this._currentNotification$
  }
  set currentNotification$(value: NotificationTopic) {
    this._currentNotification$ = value
  }

  ngOnDestroy(): void {
    this._currentNotification$?.destroy()
  }
}
