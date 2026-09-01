import { inject, InjectionToken } from '@angular/core'
import { ThemePropertiesV2 } from '@onecx/integration-interface'
import { CarouselComponentSettingsService } from './carousel-component-settings.service'

/**
 * Applies resolved theme properties to one PrimeNG component family.
 */
export interface PrimeNgComponentSettingsApplier {
  /**
   * Applies the latest resolved theme properties to all active instances
   * managed by this applier.
   *
   * @param properties Resolved V2 theme properties for the current runtime context.
   * @returns No return value.
   */
  applyThemeProperties(properties: ThemePropertiesV2): void
}

/**
 * Registry of PrimeNG runtime appliers that translate theme usage settings into
 * live component input defaults.
 */
export const PRIME_NG_COMPONENT_SETTINGS_APPLIERS = new InjectionToken<readonly PrimeNgComponentSettingsApplier[]>(
  'PRIME_NG_COMPONENT_SETTINGS_APPLIERS',
  {
    providedIn: 'root',
    factory: () => [inject(CarouselComponentSettingsService)],
  }
)