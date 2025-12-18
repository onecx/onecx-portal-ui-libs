import { ENVIRONMENT_INITIALIZER, Injectable, OnDestroy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { EventsTopic } from '@onecx/integration-interface'
import { filter } from 'rxjs'
import { CurrentLocationTopicPayload, TopicEventType } from '@onecx/integration-interface'
import { Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { Observable } from 'rxjs'
import { OneCxActions } from './onecx-actions'
import { AppStateService } from '@onecx/angular-integration-interface'

/**
 * @deprecated Please import from `@onecx/ngrx-integration-interface` instead.
 */
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
  private _eventsTopic$: EventsTopic | undefined
  get eventsTopic$() {
    this._eventsTopic$ ??= new EventsTopic()
    return this._eventsTopic$
  }
  set eventsTopic$(source: EventsTopic) {
    this._eventsTopic$ = source
  }

  constructor() {
    const store = inject(Store)
    const appStateService = inject(AppStateService)
    const capabilityService = inject(ShellCapabilityService)

    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      appStateService.currentLocation$.asObservable()
    if (!capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
      observable = this.eventsTopic$.pipe(filter((e) => e.type === 'navigated'))
    }
    observable.subscribe((navigatedEvent) => {
      let event: unknown = navigatedEvent as CurrentLocationTopicPayload
      if (!capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
        event = (navigatedEvent as TopicEventType).payload
      }
      store.dispatch(OneCxActions.navigated({ event }))
    })
  }
  ngOnDestroy(): void {
    this._eventsTopic$?.destroy()
  }
}
