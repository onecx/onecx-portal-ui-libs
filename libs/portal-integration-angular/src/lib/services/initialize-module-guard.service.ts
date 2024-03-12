import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter, from, isObservable, map, mergeMap, Observable, of, tap, zip } from 'rxjs'
import { AppStateService } from '@onecx/angular-integration-interface'
import { ConfigurationService } from './configuration.service'
import { UserService } from '@onecx/angular-integration-interface'
import { IL10nsStrings, TimeagoIntl } from 'ngx-timeago'
import { strings as englishStrings } from 'ngx-timeago/language-strings/en'
import { strings as germanStrings } from 'ngx-timeago/language-strings/de'

@Injectable({ providedIn: 'any' })
export class InitializeModuleGuard implements CanActivate {
  private SUPPORTED_LANGS = ['en', 'de']
  private LANG_TO_STRINGS: { [key: string]: IL10nsStrings } = {
    en: englishStrings,
    de: germanStrings,
  }
  private DEFAULT_LANG = 'en'
  constructor(
    protected translateService: TranslateService,
    protected configService: ConfigurationService,
    protected appStateService: AppStateService,
    protected userService: UserService,
    protected intl: TimeagoIntl
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.time('InitializeModuleGuard')
    return zip([
      this.loadTranslations(),
      from(this.configService.isInitialized),
      from(this.appStateService.currentPortal$.isInitialized),
      this.appStateService.globalLoading$.pipe(filter((g) => !g)),
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
        this.intl.strings = this.LANG_TO_STRINGS[bestMatchLang]
        console.log(`loading strings for ${bestMatchLang}`)
        this.intl.changes.next()
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
