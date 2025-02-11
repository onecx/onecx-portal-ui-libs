import { ENVIRONMENT_INITIALIZER, Inject, Injectable, InjectionToken, Optional, inject } from '@angular/core'
import { ThemeService } from '@onecx/angular-integration-interface'
import { Theme as OneCXTheme} from '@onecx/integration-interface'
import { Base } from 'primeng/base'
import { PrimeNG } from 'primeng/config'
import ThemeConfig from '../theme/theme-config'
import { CustomUseStyle } from './custom-use-style.service'
import { UseStyle } from 'primeng/usestyle'
import { Theme } from '@primeuix/styled';
import Aura from "@primeng/themes/aura"
import { mergeDeep } from '../utils/deep-merge.utils'

export const THEME_OVERRIDES = new InjectionToken<any>('THEME_OVERRIDES')

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
      useClass: CustomUseStyle
    },
  ]
}

@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  constructor(
    private themeService: ThemeService,
    private primeNG: PrimeNG,
    private useStyleService: CustomUseStyle,
    @Optional() @Inject(THEME_OVERRIDES) private themeOverrides?: any,
  ) {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.applyThemeVariables(theme)
    })
  }

  async applyThemeVariables(oldTheme: OneCXTheme): Promise<void> {
    const oldThemeVariables = oldTheme.properties
    const themeConfig = new ThemeConfig(oldThemeVariables)
    const computedPrefix = await this.useStyleService.getStyleIdentifier()
    const themeOverrides = mergeDeep(themeConfig.getConfig(), this.themeOverrides ?? {})
    this.primeNG.setThemeConfig({
      theme: {
        preset: mergeDeep(Aura, themeOverrides),
        options: {
          prefix: computedPrefix === '' ? 'p' : computedPrefix
        }
      }
    })
  }
}
