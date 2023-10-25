import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter, Observable, of, switchMap } from 'rxjs'
import { ConfigurationService } from './configuration.service'

@Injectable()
export class InitializeModuleGuard implements CanActivate {
  private SUPPORTED_LANGS = ['en', 'de']
  private DEFAULT_LANG = 'en'
  constructor(private txService: TranslateService, private config: ConfigurationService) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loadTranslations()
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
    return this.config.lang$.pipe(
      filter((v) => v !== undefined),
      switchMap((lang) => this.txService.use(this.getBestMatchLanguage(lang as string))),
      switchMap(() => of(true))
    )
  }
}
