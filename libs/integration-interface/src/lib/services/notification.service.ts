import { NotificationTopic } from "../topics/notification/v1/notification.topic";

export class NotificationService {

    private _notificationTopic$: NotificationTopic | undefined;
    get notificationTopic() {
        this._notificationTopic$ ??= new NotificationTopic()
        return this._notificationTopic$
    }
    set notificationTopic(source: NotificationTopic) {
        this._notificationTopic$ = source
    }

    destroy(): void {
        this.notificationTopic.destroy()
    }
}