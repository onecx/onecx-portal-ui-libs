import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { PageInfo } from '@onecx/integration-interface'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AppStateService } from '@onecx/angular-integration-interface'

export function provideCurrentPageStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentPageStoreConnectorService)),
    CurrentPageStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentPageStoreConnectorService {
  private appStateService = inject(AppStateService)
  constructor(private store: Store) {
    this.appStateService.currentPage$
      .pipe(untilDestroyed(this))
      .subscribe((currentPage: PageInfo | undefined) => {
        this.store.dispatch(OneCxActions.currentPageChanged({ currentPage }))
      })
  }
}
