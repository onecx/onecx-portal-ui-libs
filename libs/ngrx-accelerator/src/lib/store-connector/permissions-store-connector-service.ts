import { ENVIRONMENT_INITIALIZER, Injectable, OnDestroy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { PermissionsTopic } from '@onecx/integration-interface'
import { OneCxActions } from './onecx-actions'

export function providePermissionsStoreConnector() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(PermissionsStoreConnectorService)
      },
    },
    PermissionsStoreConnectorService,
  ]
}

@Injectable()
export class PermissionsStoreConnectorService implements OnDestroy {
  permissionsTopic$ = new PermissionsTopic()
  constructor(store: Store) {
    this.permissionsTopic$.subscribe((permissions) => {
      store.dispatch(OneCxActions.permissionsChanged({ permissions }))
    })
  }
  ngOnDestroy(): void {
    this.permissionsTopic$.destroy()
  }
}
