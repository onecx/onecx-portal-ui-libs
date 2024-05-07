import { TranslateService } from '@ngx-translate/core'
import { Observable, map } from 'rxjs'

export function enumToDropdownOptions<T extends object>(
  translateService: TranslateService,
  enumType: T,
  translationKeyPrefix: string
): Observable<{ label: string; value: T }[]> {
  return translateService.get(Object.values(enumType).map((v) => translationKeyPrefix + v)).pipe(
    map((translations) =>
      Object.values(enumType).map((v) => ({
        label: translations[translationKeyPrefix + v],
        value: v,
      }))
    )
  )
}
