import { ENVIRONMENT_INITIALIZER, Injectable, inject } from '@angular/core'
import { Theme } from '@onecx/integration-interface'
import { ThemeService } from '@onecx/angular-integration-interface'
import { updatePreset, usePreset } from '@primeng/themes'
import ThemeConfig from '../theme/theme-config'
import { PrimeNG } from 'primeng/config'

export function provideThemeConfigService() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(ThemeConfigService)
      },
    },
    ThemeConfigService,
  ]
}

@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  constructor(private themeService: ThemeService) {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.applyThemeVariables(theme)
    })
  }

  applyThemeVariables(oldTheme: Theme): void {
    const oldThemeVariables = oldTheme.properties
    const themeConfig = new ThemeConfig(oldThemeVariables)
    const customPreset = updatePreset(themeConfig.getConfig())
    //usePreset(customPreset)
    //this.primengConfig = customPreset
  }
}
