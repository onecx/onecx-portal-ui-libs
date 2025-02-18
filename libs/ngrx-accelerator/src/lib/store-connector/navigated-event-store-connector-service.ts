import { ENVIRONMENT_INITIALIZER, Injectable, OnDestroy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { EventsTopic } from '@onecx/integration-interface'
import { filter } from 'rxjs'
import { OneCxActions } from './onecx-actions'

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
  eventsTopic$ = new EventsTopic()

  constructor() {
    const store = inject(Store)

    this.eventsTopic$.pipe(filter((e) => e.type === 'navigated')).subscribe((navigatedEvent) => {
      store.dispatch(OneCxActions.navigated({ event: navigatedEvent.payload }))
    })
  }
  ngOnDestroy(): void {
    this.eventsTopic$.destroy()
  }
}
