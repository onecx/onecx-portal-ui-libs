import { Injectable, OnDestroy, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { CurrentPageTopic, PageInfo } from '@onecx/integration-interface'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export function provideCurrentPageStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentPageStoreConnectorService)),
    CurrentPageStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentPageStoreConnectorService implements OnDestroy {
  constructor(private store: Store, private currentPageTopic$: CurrentPageTopic) {
    this.currentPageTopic$
      .pipe(untilDestroyed(this))
      .subscribe((currentPage: PageInfo | undefined) => {
        this.store.dispatch(OneCxActions.currentPageChanged({ currentPage }))
      })
  }
  ngOnDestroy(): void {
    this.currentPageTopic$.destroy()
  }
}
