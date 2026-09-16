import { Injectable } from '@angular/core'
import { ThemePropertiesV2 } from '@onecx/integration-interface'
import { mapPrimeNgCarouselSettings, mapThemeUsageSettings } from '@onecx/angular-utils'
import { Carousel } from 'primeng/carousel'
import { PrimeNgComponentThemingSettingsRuntime } from './component-settings-runtime.utils'

type PrimeNgCarouselDefaults = ReturnType<typeof mapPrimeNgCarouselSettings>

/**
 * Applies Carousel-specific settings from resolved theme properties to live PrimeNG Carousel
 * instances.
 */
@Injectable({ providedIn: 'root' })
export class CarouselComponentSettingsService {
  private readonly runtime = new PrimeNgComponentThemingSettingsRuntime<Carousel, PrimeNgCarouselDefaults>({
    componentType: Carousel,
    trackedKeys: mapPrimeNgCarouselSettings.targetKeys,
    resolveDefaults: (properties) => mapThemeUsageSettings(properties, 'carousel', mapPrimeNgCarouselSettings) ?? {},
    refreshInstance: (instance) => this.refreshInstance(instance),
  })

  /**
   * Applies the settings carried by the resolved theme properties.
   *
   * @param properties Resolved V2 theme properties for the current runtime context.
   */
  applyThemeProperties(properties: ThemePropertiesV2): void {
    this.runtime.applyThemeProperties(properties)
  }

  /**
   * Recomputes the Carousel derived state that depends on the inputs the theme can set
   * (orientation, showIndicators, showNavigators, circular, autoplayInterval).
   *
   * PrimeNG does not expose a single method that recomputes these inputs: its `onChanges` only
   * reacts to `value`, `numVisible` and `numScroll`, so a later theme change does not reach the
   * instance through PrimeNG's own lifecycle. The recompute is therefore performed by invoking the
   * public methods PrimeNG already provides, mirroring what its `onAfterContentInit` runs on a
   * fresh instance:
   *
   * - the autoplay interval is reconciled explicitly, because a live instance must (re)start or
   *   stop its own timer; PrimeNG has no method that updates a running interval in place;
   * - `setCloneItems`, `createStyle` and `calculatePosition` rebuild the circular layout, the item
   *   flex sizing and the viewport position;
   * - `markForCheck` triggers change detection for the template-driven inputs (orientation class,
   *   indicator and navigator visibility).
   *
   * Every member used here is part of the public `Carousel` surface, so no cast or defensive
   * optional chaining is required. Should a future PrimeNG release rename or remove any of them,
   * this method fails to compile against the upgraded types, surfacing the change at build time.
   * The end-to-end behaviour is covered by the "should apply carousel settings to real PrimeNG
   * carousel instances" test in theme-config.service.spec.ts.
   *
   * @param instance Live Carousel instance to recompute.
   */
  private refreshInstance(instance: Carousel): void {
    instance.allowAutoplay = !!instance.autoplayInterval

    if (instance.autoplayInterval) {
      instance.startAutoplay()
    } else {
      instance.stopAutoplay(false)
    }

    if (instance.circular && instance.value) {
      instance.setCloneItems()
    }

    instance.createStyle()
    instance.calculatePosition()
    instance.cd.markForCheck()
  }
}
