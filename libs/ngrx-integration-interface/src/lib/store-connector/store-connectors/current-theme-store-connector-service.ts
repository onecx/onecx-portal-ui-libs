import { Injectable, OnDestroy, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { CurrentThemeTopic, Theme } from '@onecx/integration-interface'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export function provideCurrentThemeStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentThemeStoreConnectorService)),
    CurrentThemeStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentThemeStoreConnectorService implements OnDestroy {
  constructor(private store: Store, private currentThemeTopic$: CurrentThemeTopic) {
    this.currentThemeTopic$
      .pipe(untilDestroyed(this))
      .subscribe((currentTheme: Theme) => {
        this.store.dispatch(OneCxActions.currentThemeChanged({ currentTheme }))
      })
  }
  ngOnDestroy(): void {
    this.currentThemeTopic$.destroy()
  }
}
