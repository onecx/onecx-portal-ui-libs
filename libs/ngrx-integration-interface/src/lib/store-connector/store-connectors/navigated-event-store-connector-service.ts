import { Injectable, OnDestroy, inject, ENVIRONMENT_INITIALIZER } from '@angular/core'
import { Store } from '@ngrx/store'
import { EventsTopic } from '@onecx/integration-interface'
import { filter } from 'rxjs'
import { CurrentLocationTopicPayload, TopicEventType } from '@onecx/integration-interface'
import { Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { Observable } from 'rxjs'
import { OneCxActions } from '../onecx-actions'
import { AppStateService } from '@onecx/angular-integration-interface'

export function provideNavigatedEventStoreConnector() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(NavigatedEventStoreConnectorService)
      },
    },
    NavigatedEventStoreConnectorService,
  ]
}

@Injectable()
export class NavigatedEventStoreConnectorService implements OnDestroy {
  private appStateService = inject(AppStateService)
  private capabilityService = inject(ShellCapabilityService)
  private _eventsTopic$: EventsTopic | undefined
  get eventsTopic$(): EventsTopic {
    this._eventsTopic$ ??= new EventsTopic()
    return this._eventsTopic$
  }
  private store = inject(Store)
  constructor() {
    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      this.appStateService.currentLocation$.asObservable()
    if (!this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
      observable = this.eventsTopic$.pipe(filter((e) => e.type === 'navigated'))
    }
    observable.subscribe((navigatedEvent) => {
      let event: unknown = navigatedEvent as CurrentLocationTopicPayload
      if (!this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
        event = (navigatedEvent as TopicEventType).payload
      }
      this.store.dispatch(OneCxActions.navigated({ event }))
    })
  }
  ngOnDestroy(): void {
    this._eventsTopic$?.destroy()
  }
}
