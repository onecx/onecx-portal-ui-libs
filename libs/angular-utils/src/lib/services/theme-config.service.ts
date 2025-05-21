import { ENVIRONMENT_INITIALIZER, Injectable, inject } from '@angular/core'
import { ThemeService } from '@onecx/angular-integration-interface'
import { Theme as OneCXTheme } from '@onecx/integration-interface'
import { Base } from 'primeng/base'
import { PrimeNG } from 'primeng/config'
import ThemeConfig from '../theme/theme-config'
import { CustomUseStyle } from './custom-use-style.service'
import { UseStyle } from 'primeng/usestyle'
import { Theme } from '@primeuix/styled'
import { mergeDeep } from '../utils/deep-merge.utils'
import CustomPreset from '../theme/preset/custom-preset'

export function provideThemeConfigService() {
  Theme.clearLoadedStyleNames()
  Base.clearLoadedStyleNames()
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(ThemeConfigService)
      },
    },
    ThemeConfigService,
    {
      provide: UseStyle,
      useClass: CustomUseStyle,
    },
  ]
}

@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  constructor(
    private themeService: ThemeService,
    private primeNG: PrimeNG
  ) {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.applyThemeVariables(theme)
    })
  }

  async applyThemeVariables(oldTheme: OneCXTheme): Promise<void> {
    const oldThemeVariables = oldTheme.properties
    const themeConfig = new ThemeConfig(oldThemeVariables)
    this.primeNG.setThemeConfig({
      theme: {
        preset: mergeDeep(CustomPreset, themeConfig.getConfig()),
        options: {darkModeSelector: false}
      },
    })
  }
}
