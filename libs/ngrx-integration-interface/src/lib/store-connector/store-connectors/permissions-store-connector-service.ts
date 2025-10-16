import { Injectable, OnDestroy, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { PermissionsTopic } from '@onecx/integration-interface'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export function providePermissionsStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(PermissionsStoreConnectorService)),
    PermissionsStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class PermissionsStoreConnectorService implements OnDestroy {
  constructor(private store: Store, private permissionsTopic$: PermissionsTopic) {
    this.permissionsTopic$
      .pipe(untilDestroyed(this))
      .subscribe((permissions) => {
        this.store.dispatch(OneCxActions.permissionsChanged({ permissions }))
      })
  }
  ngOnDestroy(): void {
    this.permissionsTopic$.destroy()
  }
}
