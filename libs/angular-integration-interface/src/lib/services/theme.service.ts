import { inject, Injectable, OnDestroy } from '@angular/core'
import { CurrentThemeTopic, CurrentThemesTopic, ShellCapability, Theme as OneCXTheme } from '@onecx/integration-interface'
import { ShellCapabilityService } from './shell-capability.service'
import { createLogger } from '../utils/logger.utils'
import { map } from 'rxjs'
import { CurrentThemes } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  shellCapabilityService = inject(ShellCapabilityService)
  logger = createLogger('ThemeService')
  _currentTheme$: CurrentThemeTopic | undefined
  /**
   * @deprecated Use `currentThemes$` instead.
   */
  get currentTheme$() {
    this._currentTheme$ ??= new CurrentThemeTopic()
    return this._currentTheme$
  }
  /**
   * @deprecated Use `currentThemes$` instead.
   */
  set currentTheme$(source: CurrentThemeTopic) {
    this._currentTheme$ = source
  }
    _currentThemes$: CurrentThemesTopic | undefined
  get currentThemes$() {
    if (!this.shellCapabilityService.hasCapability(ShellCapability.CURRENT_THEMES_TOPIC)) {
      this.logger.error('CurrentThemesTopic is not supported by this version of the shell. Falling back to CurrentThemeTopic.')
      return this.currentTheme$.pipe(map((theme: OneCXTheme) => (
        {
          ...theme,
          properties: {
            v1: theme.properties ?? {},
          },
          versions: [1],
        } as unknown as CurrentThemes
      )))
    }
    this._currentThemes$ ??= new CurrentThemesTopic()
    return this._currentThemes$.asObservable()
  }
  ngOnDestroy(): void {
    this._currentTheme$?.destroy()
    this._currentThemes$?.destroy()
  }
}
