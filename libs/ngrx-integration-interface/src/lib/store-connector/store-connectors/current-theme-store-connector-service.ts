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
  private currentThemeTopic$ = new CurrentThemeTopic()
  private store = inject(Store)
  constructor() {
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
