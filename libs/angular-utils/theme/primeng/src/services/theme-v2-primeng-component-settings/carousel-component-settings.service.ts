import { Injectable } from '@angular/core'
import { ThemePropertiesV2 } from '@onecx/integration-interface'
import { mapPrimeNgCarouselSettings, mapThemeUsageSettings } from '@onecx/angular-utils'
import { Carousel } from 'primeng/carousel'
import { PrimeNgComponentSettingsRuntime } from './component-settings-runtime.utils'

type PrimeNgCarouselDefaults = ReturnType<typeof mapPrimeNgCarouselSettings>

/**
 * Applies themed settings defaults to PrimeNG Carousel component instances.
 *
 * It delegates the generic runtime patching mechanics to `PrimeNgComponentSettingsRuntime`
 * and keeps only the Carousel-specific refresh behavior in this service.
 */
@Injectable({
  providedIn: 'root',
})
export class CarouselComponentSettingsService {
  private readonly runtime = new PrimeNgComponentSettingsRuntime<Carousel, PrimeNgCarouselDefaults>({
    componentType: Carousel,
    trackedKeys: mapPrimeNgCarouselSettings.targetKeys,
    resolveDefaults: (properties) => mapThemeUsageSettings(properties, 'carousel', mapPrimeNgCarouselSettings) ?? {},
    refreshInstance: (instance) => this.refreshInstance(instance),
  })

  /**
   * Applies resolved theme properties to all active PrimeNG Carousel instances.
   *
   * @param properties Resolved V2 theme properties for the current runtime context.
   * @returns No return value.
   */
  applyThemeProperties(properties: ThemePropertiesV2): void {
    this.runtime.applyThemeProperties(properties)
  }

  /**
   * Recomputes PrimeNG Carousel internals after themed settings changed at runtime.
   *
   * This is a deliberate duplication of PrimeNG's own `ngOnChanges`/`ngAfterContentInit` refresh
   * logic, pinned to the Carousel internal API surface of `primeng@21.1.3` (`allowAutoplay`,
   * `startAutoplay`, `stopAutoplay`, `setCloneItems`, `createStyle`, `calculatePosition`, `cd`).
   * The optional chaining (`?.()`) is intentional so an unexpected shape degrades gracefully, but
   * it also means a future PrimeNG rename/remove of any of these members fails SILENTLY here. The
   * integration test in theme-config.service.spec.ts ("should apply carousel settings to real
   * PrimeNG carousel instances") is the guard: it drives a real Carousel end-to-end and must be
   * re-verified (and this list updated) whenever PrimeNG is upgraded.
   *
   * @param instance Carousel instance whose internal derived state must be refreshed.
   * @returns No return value.
   */
  private refreshInstance(instance: Carousel): void {
    const internalInstance = instance as Carousel & {
      cd: { markForCheck: () => void }
      allowAutoplay?: boolean
      createStyle?: () => void
      calculatePosition?: () => void
      startAutoplay?: () => void
      stopAutoplay?: (changeAllow?: boolean) => void
      setCloneItems?: () => void
    }

    internalInstance.allowAutoplay = !!internalInstance.autoplayInterval

    if (internalInstance.autoplayInterval) {
      internalInstance.startAutoplay?.()
    } else {
      internalInstance.stopAutoplay?.(false)
    }

    if (internalInstance.circular && internalInstance.value) {
      internalInstance.setCloneItems?.()
    }

    internalInstance.createStyle?.()
    internalInstance.calculatePosition?.()
    internalInstance.cd.markForCheck()
  }
}