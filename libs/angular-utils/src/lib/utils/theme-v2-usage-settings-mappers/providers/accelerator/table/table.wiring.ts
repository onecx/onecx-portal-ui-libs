import { assertInInjectionContext, DestroyRef, inject, Injector, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ThemeService } from '@onecx/angular-integration-interface'
import { filter, from, map, switchMap } from 'rxjs'

import { asObservable } from '../../../helpers'
import { themeVersionAvailable } from '../../../../theme-version-available.utils'
import { mapThemeUsageSettings } from '../../../../theme-usage-settings.utils'
import { mapAcceleratorTableSettings } from './table.mapper'

/**
 * Composable that exposes the `table` theme usage settings as reactive defaults for the
 * accelerator table-family components, so the table components (which live in
 * `@onecx/angular-accelerator`) only need to consume the returned signals.
 *
 * It subscribes to the current themes, gates on theme V2 being available, maps the resolved
 * `table` usage settings via {@link mapAcceleratorTableSettings}, and mirrors each mapped value
 * into a signal. Each returned signal stays `undefined` until a V2 theme with table settings
 * arrives, and the subscription is torn down with the calling component's injection context.
 */
export function useAcceleratorTableThemeDefaults() {
  assertInInjectionContext(useAcceleratorTableThemeDefaults)

  const checkboxColumnPositionThemeSetting = signal<'left' | 'right' | undefined>(undefined)
  const frozenActionColumnThemeSetting = signal<boolean | undefined>(undefined)
  const actionColumnPositionThemeSetting = signal<'left' | 'right' | undefined>(undefined)
  const themeService = inject(ThemeService, { optional: true })

  if (themeService) {
    const injector = inject(Injector)
    const destroyRef = inject(DestroyRef)

    asObservable(themeService.currentThemes$)
      .pipe(
        switchMap((theme) =>
          from(themeVersionAvailable(2, injector)).pipe(
            filter(Boolean),
            map(() => theme)
          )
        ),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe((theme) => {
        const table = mapThemeUsageSettings(theme.properties?.v2, 'table', mapAcceleratorTableSettings)
        checkboxColumnPositionThemeSetting.set(table?.checkboxColumnPosition)
        frozenActionColumnThemeSetting.set(table?.frozenActionColumn)
        actionColumnPositionThemeSetting.set(table?.actionColumnPosition)
      })
  }

  return {
    checkboxColumnPositionThemeSetting,
    frozenActionColumnThemeSetting,
    actionColumnPositionThemeSetting,
  }
}
