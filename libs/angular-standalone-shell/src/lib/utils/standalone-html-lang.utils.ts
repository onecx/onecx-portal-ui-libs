import { DOCUMENT } from '@angular/common'
import { DestroyRef, ENVIRONMENT_INITIALIZER, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'

/**
 * Language used when a translation is missing in the user language (WCAG 3.1.1).
 * Used as ngx-translate fallback language unless the app already configured one.
 * Proposed default: English (to be confirmed by the PO).
 */
export const STANDALONE_FALLBACK_LANGUAGE = 'en'

/**
 * Keeps the `lang` attribute of the document element in sync with the user language.
 * Only used by the standalone mode: inside the OneCX Shell the shell owns `<html lang>`
 * and the libraries never write it.
 */
export function provideStandaloneHtmlLang() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const document = inject(DOCUMENT)
        const userService = inject(UserService)
        const translateService = inject(TranslateService)
        const destroyRef = inject(DestroyRef)

        if (!translateService.getFallbackLang()) {
          translateService.setFallbackLang(STANDALONE_FALLBACK_LANGUAGE)
        }

        userService.lang$.pipe(takeUntilDestroyed(destroyRef)).subscribe((lang) => {
          if (lang) {
            document.documentElement.setAttribute('lang', lang)
          }
        })
      },
    },
  ]
}
