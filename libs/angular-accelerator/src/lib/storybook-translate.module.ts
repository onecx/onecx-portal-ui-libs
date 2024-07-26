import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { NgModule, importProvidersFrom } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TranslateCombinedLoader } from './utils/translate.combined.loader'
import { registerLocaleData } from '@angular/common'
import localeDE from '@angular/common/locales/de'

export function translateLoader(http: HttpClient) {
  return new TranslateCombinedLoader(new TranslateHttpLoader(http, `./assets/i18n/`, '.json'))
}
/**
  A utility module adding i18N support for Storybook stories
 **/
@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [TranslateModule, HttpClientModule],
  providers: [HttpClientModule, provideAppStateServiceMock(), importProvidersFrom(HttpClientModule)],
})
export class StorybookTranslateModule {
  constructor(translateService: TranslateService) {
    registerLocaleData(localeDE)
    const lang = translateService.getBrowserLang()
    const supportedLanguages = ['de', 'en']
    if (lang && supportedLanguages.includes(lang)) {
      translateService.use(lang)
    } else {
      translateService.use('en')
    }
  }
}
