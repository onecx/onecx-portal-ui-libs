import { Injectable, OnDestroy, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { CurrentWorkspaceTopic, Workspace } from '@onecx/integration-interface'

export function provideCurrentWorkspaceStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentWorkspaceStoreConnectorService)),
    CurrentWorkspaceStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentWorkspaceStoreConnectorService implements OnDestroy {
  constructor(private store: Store, private currentWorkspaceTopic$: CurrentWorkspaceTopic) {
    this.currentWorkspaceTopic$
      .pipe(untilDestroyed(this))
      .subscribe((currentWorkspace: Workspace) => {
        this.store.dispatch(OneCxActions.currentWorkspaceChanged({ currentWorkspace }))
      })
  }
  ngOnDestroy(): void {
    this.currentWorkspaceTopic$.destroy()
  }
}
