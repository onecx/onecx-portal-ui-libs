import { inject, InjectionToken, Injector } from '@angular/core'
import { CONFIG_KEY, ConfigurationService, ThemeService } from '@onecx/angular-integration-interface'
import { firstValueFrom } from 'rxjs'

export const THEME_MAX_VERSION = new InjectionToken<number | undefined>('THEME_MAX_VERSION')

export async function themeVersionAvailable(version: number, injector?: Injector): Promise<boolean> {
  const themeService: ThemeService = injector ? injector.get(ThemeService) : inject(ThemeService)
  const configService = injector ? injector.get(ConfigurationService) : inject(ConfigurationService)
  const injectedMaxVersion = injector
    ? injector.get(THEME_MAX_VERSION, null, { optional: true })
    : inject(THEME_MAX_VERSION, { optional: true })
  const theme = await firstValueFrom(themeService.currentThemes$)
  const maxVersion = injectedMaxVersion ?? (await configService.getProperty(CONFIG_KEY.DEFAULT_THEME_VERSION)) ?? 1
  if (version === 2) {
    return theme.versions?.includes(2) && Number(maxVersion) === 2
  } else if (version === 1) {
    return theme.versions?.includes(1) && Number(maxVersion) >= 1
  } else {
    throw new Error(`Unsupported theme version: ${version}. Supported versions are 1 and 2.`)
  }
}
