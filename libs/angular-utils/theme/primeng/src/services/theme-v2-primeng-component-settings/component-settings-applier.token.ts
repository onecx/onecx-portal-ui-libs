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
 *
 * This registry is for PrimeNG-native components only: they are themed by monkey-patching the
 * PrimeNG prototype (see `PrimeNgComponentSettingsRuntime`), which is something this library can
 * do because the components are not owned here.
 *
 * OneCX/accelerator-owned components are deliberately NOT registered here. They own their theming
 * logic and consume the resolved per-field settings directly, so routing them through this
 * PrimeNG-only registry would be a mismatch.
 */
export const PRIME_NG_COMPONENT_SETTINGS_APPLIERS = new InjectionToken<readonly PrimeNgComponentSettingsApplier[]>(
  'PRIME_NG_COMPONENT_SETTINGS_APPLIERS',
  {
    providedIn: 'root',
    factory: () => [inject(CarouselComponentSettingsService)],
  }
)