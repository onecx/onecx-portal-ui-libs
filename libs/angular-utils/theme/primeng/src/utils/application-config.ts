import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import { provideThemeConfigService } from '../services/theme-config.service'
import { InjectionToken } from '@angular/core'
import { provideAppStylesInitializer } from './app-styles-initializer'
export type ThemeOverrides = (() => Promise<any> | any) | Promise<any> | any
export type CssOverrides = (() => Promise<string> | string) | Promise<string> | string
/**
 * @deprecated Please pass overrides via the options object in provideThemeConfig instead of using this injection token directly.
 */
export const THEME_OVERRIDES = new InjectionToken<ThemeOverrides>('THEME_OVERRIDES')

export interface ThemeConfigProviderOptions {
  overrides?: ThemeOverrides
  cssOverrides?: CssOverrides
  isAdvancedTheming?: boolean
  maxVersion?: number
}

export function provideThemeConfig(options?: ThemeConfigProviderOptions) {
  const dynamicProviders = []
  if (options?.overrides) {
    dynamicProviders.push({
      provide: THEME_OVERRIDES,
      useValue: options.overrides,
    })
  }
  return [
    provideAnimationsAsync(),
    providePrimeNG({}),
    options
      ? provideThemeConfigService({
          isAdvanced: options?.isAdvancedTheming ?? false,
          maxVersion: options?.maxVersion ?? 1,
          cssOverrides: options?.cssOverrides,
          overrides: options?.overrides,
        })
      : provideThemeConfigService(),
    provideAppStylesInitializer(),
    ...dynamicProviders,
  ]
}
