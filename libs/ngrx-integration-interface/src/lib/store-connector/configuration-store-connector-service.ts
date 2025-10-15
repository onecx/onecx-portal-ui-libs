import { ENVIRONMENT_INITIALIZER, Injectable, inject } from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import { ConfigurationTopic } from '@onecx/integration-interface'
import { OneCxActions } from './onecx-actions'

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
  config$ = new ConfigurationTopic()
  constructor(private store: Store) {}
  ngOnInit(): void {
    this.config$
      .pipe(untilDestroyed(this))
      .subscribe((config) => {
        this.store.dispatch(OneCxActions.configChanged({ config }))
      })
  }
  ngOnDestroy(): void {
    this.config$.destroy()
  }
}
