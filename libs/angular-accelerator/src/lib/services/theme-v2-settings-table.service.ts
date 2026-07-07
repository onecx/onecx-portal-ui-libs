import { computed, Injectable, inject, signal } from '@angular/core'
import { ThemeService } from '@onecx/angular-integration-interface'
import { mapThemeUsageSettings, mapAcceleratorTableSettings } from '@onecx/angular-utils'
import { ThemePropertiesV2 } from '@onecx/integration-interface'

@Injectable({
  providedIn: 'root',
})
export class ThemeTableSettingsService {
  private readonly themeService = inject(ThemeService, { optional: true })
  private readonly properties = signal<ThemePropertiesV2 | undefined>(undefined)

  readonly table = computed(() => {
    return mapThemeUsageSettings(this.properties(), 'table', mapAcceleratorTableSettings) ?? {}
  })

  constructor() {
    this.themeService?.currentThemes$.subscribe((theme) => {
      this.properties.set(theme.properties?.v2)
    })
  }
}