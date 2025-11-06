import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { UserService } from '@onecx/angular-integration-interface'

export function providePermissionsStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(PermissionsStoreConnectorService)),
    PermissionsStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class PermissionsStoreConnectorService {
  private userService = inject(UserService)
  private store = inject(Store)
  constructor() {
    this.userService.getPermissions()
      .pipe(untilDestroyed(this))
      .subscribe((permissions) => {
        this.store.dispatch(OneCxActions.permissionsChanged({ permissions }))
      })
  }
}
