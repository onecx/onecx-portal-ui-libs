import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter, from, isObservable, map, mergeMap, Observable, of, tap, zip } from 'rxjs'
import { AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { UserService } from '@onecx/angular-integration-interface'

@Injectable({ providedIn: 'any' })
export class InitializeModuleGuard implements CanActivate {
  private SUPPORTED_LANGS = ['en', 'de']
  private DEFAULT_LANG = 'en'
  constructor(
    protected translateService: TranslateService,
    protected configService: ConfigurationService,
    protected appStateService: AppStateService,
    protected userService: UserService
  ) {}

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
