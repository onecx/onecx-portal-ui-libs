import { Injectable, inject, ENVIRONMENT_INITIALIZER } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { AppConfigService } from '@onecx/angular-integration-interface'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export function provideAppConfigStoreConnector() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(AppConfigStoreConnectorService)
      },
    },
    AppConfigStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class AppConfigStoreConnectorService {
  private appConfigService = inject(AppConfigService)
  private store = inject(Store)
  constructor() {
    this.appConfigService.config$
      .pipe(untilDestroyed(this))
      .subscribe((appConfig) => {
        this.store.dispatch(OneCxActions.appConfigChanged({ appConfig }))
      })
  }
}
