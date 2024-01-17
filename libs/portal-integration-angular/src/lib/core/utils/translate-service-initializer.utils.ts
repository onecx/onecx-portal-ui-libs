import { TranslateService } from '@ngx-translate/core'
import { firstValueFrom, mergeMap, tap } from 'rxjs'
import { UserService } from '../../services/user.service'

export function translateServiceInitializer(userService: UserService, translateService: TranslateService): () => Promise<unknown> {
  return () => {
    translateService.setDefaultLang('en')
    return firstValueFrom(
      userService.lang$.pipe(
        mergeMap((l) => {
          return translateService.use(l).pipe(tap((t) => console.log('RETURN TAP USE ', t)))
        })
      )
    )
  }
}
