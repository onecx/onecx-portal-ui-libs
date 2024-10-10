import { EventsTopic } from '@onecx/integration-interface'
import { ENVIRONMENT_INITIALIZER, Injectable, OnDestroy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
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
  constructor(store: Store) {
    this.eventsTopic$.pipe(filter((e) => e.type === 'navigated')).subscribe((eventType) => {
      store.dispatch(OneCxActions.navigated({ event: eventType.payload }))
    })
  }
  ngOnDestroy(): void {
    this.eventsTopic$.destroy()
  }
}
