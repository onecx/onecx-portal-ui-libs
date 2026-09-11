import { DestroyRef, Injector, assertInInjectionContext, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ThemeService } from '@onecx/angular-integration-interface'
import {
  asObservable,
  mapAcceleratorTableSettings,
  mapThemeUsageSettings,
  themeVersionAvailable,
} from '@onecx/angular-utils'
import { filter, from, map, switchMap } from 'rxjs'

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