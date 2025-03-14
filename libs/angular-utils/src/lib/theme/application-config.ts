import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import CustomPreset from './preset/custom-preset'
import { provideThemeConfigService } from '../services/theme-config.service'
import { toVariables } from '@primeuix/styled'
import { InjectionToken } from '@angular/core'

export interface ThemeOverridesCssVariables {
  value: Array<string>
  css: string
}
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

function mapOverridesToThemeVariableValues(overrides: ThemeOverrides): ThemeOverridesCssVariables {
  if (!overrides)
    return {
      value: [],
      css: '',
    }
  const variablesData = toVariables(overrides)
  return {
    value: variablesData.value,
    css: variablesData.css,
  }
}
