import { Injectable, inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Observable, filter, from, isObservable, map, mergeMap, of, tap, zip } from 'rxjs'
import { AppStateService } from './app-state.service'
import { ConfigurationService } from './configuration.service'
import { UserService } from './user.service'

@Injectable({ providedIn: 'any' })
export class InitializeModuleGuard implements CanActivate {
  protected translateService = inject(TranslateService)
  protected configService = inject(ConfigurationService)
  protected appStateService = inject(AppStateService)
  protected userService = inject(UserService)

  private SUPPORTED_LANGS = ['en', 'de']
  private DEFAULT_LANG = 'en'

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.time('InitializeModuleGuard')
    return zip([
      this.loadTranslations(),
      from(this.configService.isInitialized),
      from(this.userService.isInitialized),
      from(this.appStateService.currentWorkspace$.isInitialized),
    ]).pipe(
      tap(() => {
        console.timeEnd('InitializeModuleGuard')
      }),
      map(() => true)
    )
  }

  getBestMatchLanguage(lang: string) {
    if (this.SUPPORTED_LANGS.includes(lang)) {
      return lang
    } else {
      console.log(`${lang} is not supported. Using ${this.DEFAULT_LANG} as a fallback.`)
    }
    return this.DEFAULT_LANG
  }

  loadTranslations(): Observable<boolean> {
    return this.userService.lang$.pipe(
      filter((v) => v !== undefined),
      mergeMap((lang) => {
        const bestMatchLang = this.getBestMatchLanguage(lang as string)
        return this.translateService.use(bestMatchLang)
      }),
      mergeMap(() => of(true))
    )
  }

  protected toObservable(
    canActivateResult: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  ): Observable<boolean | UrlTree> {
    if (isObservable(canActivateResult)) {
      return canActivateResult
    }
    return from(Promise.resolve(canActivateResult))
  }
}
