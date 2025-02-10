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

  isObject(item: any): any {
    return item && typeof item === 'object' && !Array.isArray(item)
  }

  // TODO: Extract to utils and remove from translate.combined.loader
  mergeDeep(target: any, source: any): any {
    const output = Object.assign({}, target)
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] })
          else output[key] = this.mergeDeep(target[key], source[key])
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }
    return output
  }

  async applyThemeVariables(oldTheme: OneCXTheme): Promise<void> {
    const oldThemeVariables = oldTheme.properties
    const themeConfig = new ThemeConfig(oldThemeVariables)
    const computedPrefix = await this.useStyleService.getStyleIdentifier()
    const themeOverrides = this.mergeDeep(themeConfig.getConfig(), this.themeOverrides ?? {})
    this.primeNG.setThemeConfig({
      theme: {
        preset: this.mergeDeep(Aura, themeOverrides),
        options: {
          prefix: computedPrefix === '' ? 'p' : computedPrefix
        }
      }
    })
  }
}
