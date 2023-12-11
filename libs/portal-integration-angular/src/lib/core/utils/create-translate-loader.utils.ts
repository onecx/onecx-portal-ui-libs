import { HttpClient } from "@angular/common/http"
import { TranslateLoader } from "@ngx-translate/core"
import { TranslateHttpLoader } from "@ngx-translate/http-loader"
import { combineLatest, filter, map } from "rxjs"
import { AppStateService } from "../../services/app-state.service"
import { AsyncTranslateLoader } from "./async-translate-loader.utils"
import { TranslateCombinedLoader } from "./translate.combined.loader"

export class CreateTranslateLoader {
    createTranslateLoader(http: HttpClient, appStateService: AppStateService): TranslateLoader {
        return new AsyncTranslateLoader(
          combineLatest([appStateService.currentMfe$.asObservable(), appStateService.globalLoading$.asObservable()]).pipe(
            filter(([, isLoading]) => !isLoading),
            map(([currentMfe]) => {
              if (currentMfe.remoteBaseUrl) {
                return new TranslateCombinedLoader(
                  new TranslateHttpLoader(http, `${currentMfe.remoteBaseUrl}/assets/i18n/`, '.json'),
                  new TranslateHttpLoader(http, `./assets/i18n/`, '.json'),
                  new TranslateHttpLoader(http, `./onecx-portal-lib/assets/i18n/`, '.json')
                )
              } else {
                return new TranslateCombinedLoader(
                  new TranslateHttpLoader(http, `./assets/i18n/`, '.json'),
                  new TranslateHttpLoader(http, `./onecx-portal-lib/assets/i18n/`, '.json')
                )
              }
            })
          )
        )
      }
}