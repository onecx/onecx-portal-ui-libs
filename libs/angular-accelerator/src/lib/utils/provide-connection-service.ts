import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core'
import { ConnectionService } from '@onecx/angular-integration-interface'

export function provideConnectionService() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(ConnectionService)
      },
    },
    ConnectionService,
  ]
}
