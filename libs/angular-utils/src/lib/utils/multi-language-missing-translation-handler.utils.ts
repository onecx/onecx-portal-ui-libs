import { inject, Injectable } from '@angular/core'
import { getValue, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap, shareReplay, take } from 'rxjs/operators'

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly userService = inject(UserService)
  handle(params: MissingTranslationHandlerParams): Observable<string> {
    const locales$ = this.userService.profile$.pipe(
      map((p) => {
        if (p.accountSettings?.localeAndTimeSettings?.locales) {
          return p.accountSettings?.localeAndTimeSettings?.locales
        }
        return getNormalizedBrowserLocales()
      }),
      take(1),
      shareReplay(1)
    )

    return loadTranslations(locales$, params)
  }
}

function dummyLoad(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
  return params.translateService.reloadLang(lang).pipe(
    map((interpolatableTranslationObject: Record<string, any>) => {
      const translatedValue = params.translateService.parser.interpolate(
        getValue(interpolatableTranslationObject, params.key),
        params.interpolateParams
      )
      if (!translatedValue) {
        throw new Error(`No translation found for key: ${params.key} in language: ${lang}`)
      }
      return translatedValue
    })
  )
}

function loadTranslations(
  langConfig: Observable<string[]>,
  params: MissingTranslationHandlerParams
): Observable<string> {
  return langConfig.pipe(
    mergeMap((l) => {
      const langs = [...l]
      const chain = (o: Observable<string[]>): Observable<any> => {
        return o.pipe(
          mergeMap((lang) => {
            return dummyLoad(lang[0], params)
          }),
          catchError(() => {
            langs.shift()
            if (langs.length === 0) {
              throw new Error(`No translation found for key: ${params.key}`)
            }
            return chain(of(langs))
          })
        )
      }
      return chain(of(langs))
    })
  )
}
