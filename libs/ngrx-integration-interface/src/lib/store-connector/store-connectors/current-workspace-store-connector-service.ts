import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Workspace } from '@onecx/integration-interface'
import { AppStateService } from '@onecx/angular-integration-interface'

export function provideCurrentWorkspaceStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentWorkspaceStoreConnectorService)),
    CurrentWorkspaceStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentWorkspaceStoreConnectorService {
  private appStateService = inject(AppStateService)
  private store = inject(Store)
  constructor() {
    this.appStateService.currentWorkspace$
      .pipe(untilDestroyed(this))
      .subscribe((currentWorkspace: Workspace) => {
        this.store.dispatch(OneCxActions.currentWorkspaceChanged({ currentWorkspace }))
      })
  }
}
