import { EventsTopic } from '@onecx/integration-interface'
import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { filter } from 'rxjs'
import { OneCxActions } from './onecx-actions'
import { LocationState } from './onecx-state'

export function provideNavigatedEventStoreConnector() {
  return [NavigatedEventStoreConnectorService]
}

@Injectable()
export class NavigatedEventStoreConnectorService implements OnDestroy {
  eventsTopic$ = new EventsTopic()
  constructor(store: Store) {
    this.eventsTopic$.pipe(filter((e) => e.type === 'navigated')).subscribe((eventType) => {
      store.dispatch(OneCxActions.onecxNavigated({ location: eventType.payload as LocationState })) // TO be improved
    })
  }
  ngOnDestroy(): void {
    this.eventsTopic$.destroy()
  }
}
