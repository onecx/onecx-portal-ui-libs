import { ENVIRONMENT_INITIALIZER, Injectable, inject } from '@angular/core'
import { ThemeService } from '@onecx/angular-integration-interface'
import { Theme as OneCXTheme } from '@onecx/integration-interface'
import { Base } from 'primeng/base'
import { PrimeNG } from 'primeng/config'
import ThemeConfig from '../utils/theme-config'
import { CustomUseStyle } from './custom-use-style.service'
import { UseStyle } from 'primeng/usestyle'
import { Theme } from '@primeuix/styled'
import { mergeDeep } from '@onecx/angular-utils'

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
  private themeService = inject(ThemeService);
  private primeNG = inject(PrimeNG);

  constructor() {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.applyThemeVariables(theme)
    })
  }

  async applyThemeVariables(oldTheme: OneCXTheme): Promise<void> {
    const oldThemeVariables = oldTheme.properties
    const themeConfig = new ThemeConfig(oldThemeVariables)
    const preset = await (await import('../preset/custom-preset')).CustomPreset
    this.primeNG.setThemeConfig({
      theme: {
        preset: mergeDeep(preset, themeConfig.getConfig()),
        options: { darkModeSelector: false },
      },
    })
  }
}
