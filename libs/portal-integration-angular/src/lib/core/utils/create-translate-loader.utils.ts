import { HttpClient } from '@angular/common/http'
import { TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { combineLatest, filter, first, map, mergeMap, of } from 'rxjs'
import { CONFIG_KEY } from '../../model/config-key.model'
import { AppStateService } from '../../services/app-state.service'
import { ConfigurationService } from '../../services/configuration.service'
import { AsyncTranslateLoader } from './async-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'

export function createTranslateLoader(
  http: HttpClient,
  appStateService: AppStateService,
  configService: ConfigurationService
): TranslateLoader {
  return new AsyncTranslateLoader(
    configService.config$.pipe(
      first(),
      mergeMap(() => {
        if (configService.getProperty(CONFIG_KEY.IS_SHELL)) {
          return combineLatest([
            appStateService.currentMfe$.asObservable(),
            appStateService.globalLoading$.asObservable(),
          ]).pipe(
            filter(([, isLoading]) => !isLoading),
            map(([currentMfe]) => {
              return new TranslateCombinedLoader(
                new TranslateHttpLoader(http, `${currentMfe.remoteBaseUrl}/assets/i18n/`, '.json'),
                new TranslateHttpLoader(http, `./assets/i18n/`, '.json'),
                new TranslateHttpLoader(http, `./onecx-portal-lib/assets/i18n/`, '.json')
              )
            })
          )
        } else {
          return of(
            new TranslateCombinedLoader(
              new TranslateHttpLoader(http, `./assets/i18n/`, '.json'),
              new TranslateHttpLoader(http, `./onecx-portal-lib/assets/i18n/`, '.json')
            )
          )
        }
      })
    )
  )
}
