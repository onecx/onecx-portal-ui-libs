import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import CustomPreset from './preset/custom-preset'
import { THEME_OVERRIDES, provideThemeConfigService } from '../services/theme-config.service'

export interface ThemeConfigProviderOptions {
  overrides?: any
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
