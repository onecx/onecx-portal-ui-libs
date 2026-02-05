import { ENVIRONMENT_INITIALIZER, Injectable, InjectionToken, inject } from '@angular/core'
import { ThemeService } from '@onecx/angular-integration-interface'
import { Theme as OneCXTheme, OverrideType, ThemeOverride } from '@onecx/integration-interface'
import { Base } from 'primeng/base'
import { PrimeNG } from 'primeng/config'
import ThemeConfig from '../utils/theme-config'
import { CustomUseStyle } from './custom-use-style.service'
import { UseStyle } from 'primeng/usestyle'
import { Theme } from '@primeuix/styled'
import { mergeDeep } from '@onecx/angular-utils'

export const IS_ADVANCED_THEMING = new InjectionToken<boolean>('IS_ADVANCED_THEMING');

export function provideThemeConfigService(isAdvanced?: boolean) {
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
    { provide: IS_ADVANCED_THEMING, useValue: isAdvanced ?? false }
  ]
}

@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  private themeService = inject(ThemeService);
  private primeNG = inject(PrimeNG);
  private readonly isAdvancedTheming = inject(IS_ADVANCED_THEMING);

  constructor() {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.applyThemeVariables(theme)
    })
  }
 
  private foldOverrides(overrides?: ThemeOverride[]){
    if (!overrides?.length) return {};

    return overrides.reduce((result, override) => {
      if (!override.value) return result;
      return mergeDeep(result, override.value);
    }, {} );
  }

  private parsePrimeNGOverridesValue(overrides?: ThemeOverride[]){
    if (!overrides?.length) return {};
    const parsedOverrides: any = []
    overrides.filter(el => el.type === OverrideType.PRIMENG).forEach((element: ThemeOverride) => {
      if (element.value) {
        const override = { ...element, value: JSON.parse(element.value) }
        parsedOverrides.push(override)
      }
    })
    return parsedOverrides
  }

  async applyThemeVariables(oldTheme: OneCXTheme): Promise<void> {
    const oldThemeVariables = oldTheme.properties
    const overridesFolded = this.isAdvancedTheming ? this.foldOverrides(this.parsePrimeNGOverridesValue(oldTheme.overrides)) : {}

    const themeConfig = new ThemeConfig(oldThemeVariables)
    const preset = await (await import('../preset/custom-preset')).CustomPreset
    this.primeNG.setThemeConfig({
      theme: {
        preset: mergeDeep(preset, mergeDeep(themeConfig.getConfig(),overridesFolded)),
        options: { darkModeSelector: false },
      },
    })
  }
}
