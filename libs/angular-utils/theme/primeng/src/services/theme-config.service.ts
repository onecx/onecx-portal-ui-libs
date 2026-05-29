import { ENVIRONMENT_INITIALIZER, Injectable, InjectionToken, Injector, inject, runInInjectionContext } from '@angular/core'
import { CONFIG_KEY, ConfigurationService, ThemeService } from '@onecx/angular-integration-interface'
import {
  OverrideType,
  Theme as OneCXTheme,
  ThemeOverride,
  ThemePropertiesV2,
  ThemeCommonData,
  CurrentThemes,
  RegionOverridesInput,
} from '@onecx/integration-interface'
import { Base } from 'primeng/base'
import { PrimeNG } from 'primeng/config'
import ThemeConfig from '../utils/theme-config'
import { CustomUseStyle } from './custom-use-style.service'
import { UseStyle } from 'primeng/usestyle'
import { Theme } from '@primeuix/styled'
import { mergeDeep, SLOT_GROUP_NAME } from '@onecx/angular-utils'
import { mapThemeToPreset } from '../utils/mapper/mapper'
import { CssOverrides, ThemeOverrides } from '../utils/application-config'
import { firstValueFrom, of } from 'rxjs'

export const IS_ADVANCED_THEMING = new InjectionToken<boolean>('IS_ADVANCED_THEMING')

type Options = { isAdvanced?: boolean; maxVersion: number; cssOverrides?: CssOverrides; overrides?: ThemeOverrides }

export const THEME_OPTIONS = new InjectionToken<Options>('THEME_OPTIONS')

/**
    @deprecated
    */
export function provideThemeConfigService(isAdvanced?: boolean): any
export function provideThemeConfigService(options: Options): any

export function provideThemeConfigService(isAdvancedOrOptions?: boolean | Options): any {
  Theme.clearLoadedStyleNames()
  Base.clearLoadedStyleNames()
  const isAdvanced = typeof isAdvancedOrOptions === 'boolean' ? isAdvancedOrOptions : isAdvancedOrOptions?.isAdvanced
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
    { provide: IS_ADVANCED_THEMING, useValue: isAdvanced ?? false },
    {
      provide: THEME_OPTIONS,
      useValue:
        typeof isAdvancedOrOptions === 'boolean' ? { isAdvanced: isAdvancedOrOptions } : (isAdvancedOrOptions ?? {}),
    },
  ]
}

interface ThemeV2 extends ThemeCommonData {
  properties: ThemePropertiesV2
}
@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  private themeService = inject(ThemeService)
  private configService = inject(ConfigurationService)
  private primeNG = inject(PrimeNG)
  private readonly isAdvancedTheming = inject(IS_ADVANCED_THEMING)
  private readonly options = inject(THEME_OPTIONS)
  private readonly slotGroupName = inject(SLOT_GROUP_NAME, { optional: true }) ?? of('')
  private readonly injector = inject(Injector)

  constructor() {
    this.themeService.currentThemes$.subscribe(async (theme) => {
      const maxVersion =
        this.options.maxVersion ?? (await this.configService.getProperty(CONFIG_KEY.DEFAULT_THEME_VERSION)) ?? 1
      if (theme.versions?.includes(2) && Number(maxVersion) === 2) {
        this.applyThemeVariablesV2({
          ...theme,
          properties: theme.properties?.v2 ?? {},
        })
      } else if (theme.versions?.includes(1) && Number(maxVersion) >= 1) {
        this.applyThemeVariablesV1({
          ...theme,
          properties: theme.properties.v1,
        })
      } else {
        throw new Error(
          `App is requesting a non-existing theme version. Available versions: ${theme.versions?.join(', ')}, requested maximum version: ${maxVersion}`
        )
      }
    })
  }

  private foldOverrides(overrides?: ThemeOverride[]) {
    if (!overrides?.length) return {}

    return overrides.reduce((result, override) => {
      if (!override.value) return result
      return mergeDeep(result, override.value)
    }, {})
  }

  private parsePrimeNGOverridesValue(overrides?: ThemeOverride[]) {
    if (!overrides?.length) return {}
    const parsedOverrides: any = []
    overrides
      .filter((el) => el.type === OverrideType.PRIMENG)
      .forEach((element: ThemeOverride) => {
        if (element.value) {
          const override = { ...element, value: JSON.parse(element.value) }
          parsedOverrides.push(override)
        }
      })
    return parsedOverrides
  }

  async applyThemeVariablesV2(
    theme: CurrentThemes & {
      properties: ThemePropertiesV2
    }
  ): Promise<void> {
    const overridesFolded = this.generateThemeOverrides(theme.overrides)
    const regionName = this.dashToCamelCase(await firstValueFrom(this.slotGroupName, { defaultValue: '' })) as keyof RegionOverridesInput
    let properties = null
    const regionOverrides = theme.properties.regionOverrides
    if (regionName && regionOverrides) {
       const region = regionOverrides[regionName]
       const primitives = region?.primitives ?? {}
       const usages = region?.usages ?? {}
       properties = {
        primitives: mergeDeep(theme.properties.primitives, primitives),
        usages: mergeDeep(theme.properties.usages, usages)
      }
    } else {
      properties = theme.properties
    }
    const { variables, css } = mapThemeToPreset(properties)
    const cssOverrides = this.options.cssOverrides
    const overrides = Promise.resolve(
      typeof cssOverrides === 'function' && cssOverrides !== undefined
        ? runInInjectionContext(this.injector, () => cssOverrides())
        : cssOverrides
    )
    const joinedCustomCss = css + (await overrides ?? '')
    this.primeNG.setThemeConfig({
      theme: {
        preset: { ...mergeDeep(variables, overridesFolded), css: joinedCustomCss },
        options: { darkModeSelector: 'system' },
      },
    })
  }

  async applyThemeVariablesV1(oldTheme: OneCXTheme): Promise<void> {
    const oldThemeVariables = oldTheme.properties
    const overridesFolded = this.generateThemeOverrides(oldTheme.overrides)

    const themeConfig = new ThemeConfig(oldThemeVariables)
    const preset = await (await import('../preset/custom-preset')).CustomPreset
    this.primeNG.setThemeConfig({
      theme: {
        preset: mergeDeep(preset, mergeDeep(themeConfig.getConfig(), overridesFolded)),
        options: { darkModeSelector: false },
      },
    })
  }

  private generateThemeOverrides(overrides: Array<ThemeOverride> | undefined) {
    if (!overrides?.length) {
      return {}
    }
    return this.isAdvancedTheming || this.options.isAdvanced
      ? this.foldOverrides(this.parsePrimeNGOverridesValue(overrides))
      : {}
  }

  private dashToCamelCase(value: string): string{
    return value?.replace(/-([a-z])/g, (_: string, letter: string) =>
      letter.toUpperCase()
    );
  }
} 
