import { Injectable, inject, ENVIRONMENT_INITIALIZER } from '@angular/core'
import { Store } from '@ngrx/store'
import { MfeInfo } from '@onecx/integration-interface'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AppStateService } from '@onecx/angular-integration-interface'

export function provideCurrentMfeStoreConnector() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(CurrentMfeStoreConnectorService)
      },
    },
    CurrentMfeStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentMfeStoreConnectorService {
  private appStateService = inject(AppStateService)
  private store = inject(Store)
  constructor() {
    this.appStateService.currentMfe$
      .pipe(untilDestroyed(this))
      .subscribe((currentMfe: MfeInfo) => {
        this.store.dispatch(OneCxActions.currentMfeChanged({ currentMfe }))
      })
  }
}
