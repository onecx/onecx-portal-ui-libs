import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { AppConfigService } from '@onecx/angular-integration-interface'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export function provideAppConfigStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(AppConfigStoreConnectorService)),
    AppConfigStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class AppConfigStoreConnectorService {
  constructor(private store: Store, private appConfigService: AppConfigService) {
    this.appConfigService.config$
      .pipe(untilDestroyed(this))
      .subscribe((appConfig) => {
        this.store.dispatch(OneCxActions.appConfigChanged({ appConfig }))
      })
  }
}
