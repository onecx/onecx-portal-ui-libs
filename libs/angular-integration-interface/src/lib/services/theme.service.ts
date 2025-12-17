import { Injectable, OnDestroy } from '@angular/core'
import { CurrentThemeTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  _currentTheme$: CurrentThemeTopic | undefined
  get currentTheme$() {
    this._currentTheme$ ??= new CurrentThemeTopic()
    return this._currentTheme$
  }
  ngOnDestroy(): void {
    this._currentTheme$?.destroy()
  }
}
