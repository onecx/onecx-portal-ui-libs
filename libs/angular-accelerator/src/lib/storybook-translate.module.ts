import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { NgModule, inject } from '@angular/core'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
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
  exports: [TranslateModule],
  imports: [
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [provideAppStateServiceMock(), provideHttpClient(withInterceptorsFromDi())],
})
export class StorybookTranslateModule {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const translateService = inject(TranslateService);

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
