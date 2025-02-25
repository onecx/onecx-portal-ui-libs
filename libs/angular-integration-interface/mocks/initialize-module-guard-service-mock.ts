import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { of, Observable } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { ConfigurationService } from '../src/lib/services/configuration.service'
import { AppStateService } from '../src/lib/services/app-state.service'
import { UserService } from '../src/lib/services/user.service'

@Injectable({ providedIn: 'any' })
export class InitializeModuleGuardServiceMock implements CanActivate {
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
    return of(true)
  }

  getBestMatchLanguage(lang: string): string {
    if (this.SUPPORTED_LANGS.includes(lang)) {
      return lang
    } else {
      console.log(`${lang} is not supported. Using ${this.DEFAULT_LANG} as a fallback.`)
    }
    return this.DEFAULT_LANG
  }

  loadTranslations(): Observable<boolean> {
    return of(true)
  }

  protected toObservable(
    canActivateResult: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  ): Observable<boolean | UrlTree> {
    return of(true)
  }
}
