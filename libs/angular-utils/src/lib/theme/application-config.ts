import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import CustomPreset from './preset/custom-preset'
import { provideThemeConfigService } from '../services/theme-config.service'
import { toVariables } from '@primeuix/styled'
import { InjectionToken } from '@angular/core'

export type ThemeOverridesCssVariables = Array<string>
export type ThemeOverrides = (() => Promise<any> | any) | Promise<any> | any
export const THEME_OVERRIDES = new InjectionToken<ThemeOverridesCssVariables>('THEME_OVERRIDES')

export interface ThemeConfigProviderOptions {
  overrides?: ThemeOverrides
}

export function provideThemeConfig(options?: ThemeConfigProviderOptions) {
  const dynamicProviders = []
  if (options?.overrides) {
    dynamicProviders.push({
      provide: THEME_OVERRIDES,
      useValue: mapOverridesToThemeVariableValues(options.overrides),
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

function mapOverridesToThemeVariableValues(overrides: ThemeOverrides): Array<string> {
  if (!overrides) return []
  const variablesData = toVariables(overrides)
  return variablesData.value
}
