import { Injectable, OnDestroy, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { CurrentMfeTopic, MfeInfo } from '@onecx/integration-interface'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export function provideCurrentMfeStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentMfeStoreConnectorService)),
    CurrentMfeStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentMfeStoreConnectorService implements OnDestroy {
  constructor(private store: Store, private currentMfeTopic$: CurrentMfeTopic) {
    this.currentMfeTopic$
      .pipe(untilDestroyed(this))
      .subscribe((currentMfe: MfeInfo) => {
        this.store.dispatch(OneCxActions.currentMfeChanged({ currentMfe }))
      })
  }
  ngOnDestroy(): void {
    this.currentMfeTopic$.destroy()
  }
}
