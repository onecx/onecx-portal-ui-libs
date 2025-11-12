import { Injectable, inject, ENVIRONMENT_INITIALIZER } from '@angular/core'
import { UntilDestroy } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { OneCxActions } from '../onecx-actions'

export function provideConfigurationStoreConnector() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(ConfigurationStoreConnectorService)
      },
    },
    ConfigurationStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class ConfigurationStoreConnectorService {
  private configService = inject(ConfigurationService)
  private store = inject(Store)
  constructor() {
    this.configService.isInitialized.then(() => {
      const config = this.configService.getConfig()
      if (config) {
        this.store.dispatch(OneCxActions.configChanged({ config }))
      }
    })
  }
}
