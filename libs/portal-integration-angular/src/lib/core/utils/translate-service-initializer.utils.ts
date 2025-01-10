import { TranslateService } from '@ngx-translate/core'
import { firstValueFrom, mergeMap } from 'rxjs'
import { UserService } from '@onecx/angular-integration-interface'

// TODO: Deprecate?
export function translateServiceInitializer(
  userService: UserService,
  translateService: TranslateService
): () => Promise<unknown> {
  return () => {
    translateService.setDefaultLang('en')
    return firstValueFrom(
      userService.lang$.pipe(
        mergeMap((l) => {
          return translateService.use(l)
        })
      )
    )
  }
}
