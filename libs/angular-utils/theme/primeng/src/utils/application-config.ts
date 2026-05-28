import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import { provideThemeConfigService } from '../services/theme-config.service'
import { InjectionToken } from '@angular/core'
import { provideAppStylesInitializer } from './app-styles-initializer'
export type ThemeOverrides = (() => Promise<any> | any) | Promise<any> | any
export const THEME_OVERRIDES = new InjectionToken<ThemeOverrides>('THEME_OVERRIDES')

export interface ThemeConfigProviderOptions {
  overrides?: ThemeOverrides
  isAdvancedTheming?: boolean
  maxVersion: number
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
        })
      : provideThemeConfigService(),
    provideAppStylesInitializer(),
    ...dynamicProviders,
  ]
}
