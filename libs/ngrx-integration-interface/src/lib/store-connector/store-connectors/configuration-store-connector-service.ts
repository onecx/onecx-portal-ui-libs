import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { Config } from '@onecx/integration-interface'
import { OneCxActions } from '../onecx-actions'

export function provideConfigurationStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(ConfigurationStoreConnectorService)),
    ConfigurationStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class ConfigurationStoreConnectorService {
  private configService = inject(ConfigurationService)
  private store = inject(Store)
  constructor() {
    this.configService.config$.pipe(untilDestroyed(this)).subscribe((config: Config) => {
      this.store.dispatch(OneCxActions.configChanged({ config }))
    })
  }
}
