import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import CustomPreset from './preset/custom-preset'
import { provideThemeConfigService } from '../services/theme-config.service'
import { InjectionToken } from '@angular/core'

export type ThemeOverrides = (() => Promise<any> | any) | Promise<any> | any
export const THEME_OVERRIDES = new InjectionToken<ThemeOverrides>('THEME_OVERRIDES')

export interface ThemeConfigProviderOptions {
  overrides?: ThemeOverrides
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
    providePrimeNG({
      theme: {
        preset: CustomPreset,
      },
    }),
    provideThemeConfigService(),
    ...dynamicProviders,
  ]
}
