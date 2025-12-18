import { EventsTopic, CurrentLocationTopicPayload, TopicEventType } from '@onecx/integration-interface'
import { Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { ENVIRONMENT_INITIALIZER, Injectable, OnDestroy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { filter, Observable } from 'rxjs'
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
  set eventsTopic$(value: EventsTopic) {
    this._eventsTopic$ = value
  }
  constructor(
    store: Store,
    private readonly capabilityService: ShellCapabilityService,
    private readonly appStateService: AppStateService
  ) {
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
      store.dispatch(OneCxActions.navigated({ event }))
    })
  }
  ngOnDestroy(): void {
    this._eventsTopic$?.destroy()
  }
}
