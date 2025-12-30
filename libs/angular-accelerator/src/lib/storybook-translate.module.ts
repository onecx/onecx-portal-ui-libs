import { registerLocaleData } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import localeDE from '@angular/common/locales/de'
import { NgModule, inject } from '@angular/core'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TRANSLATION_PATH, TranslateCombinedLoader, createTranslateLoader } from '@onecx/angular-utils'

export function translateLoader(http: HttpClient) {
  return new TranslateCombinedLoader(new TranslateHttpLoader(http, `./assets/i18n/`, '.json'))
}
/**
 * StorybookTranslateModule
 *
 * Add feature-specific translation files (e.g., only pageheader keys) to libs/angular-accelerator/assets/i18n/.
 *
 * Reference each file in TRANSLATION_PATH using its base path (e.g., '/assets/i18n/page-header').
 * The loader will append the language suffix and .json automatically.
 *
 * Example:
 *   { provide: TRANSLATION_PATH, useValue: '/assets/i18n/page-header', multi: true }
 **/
const STORYBOOK_TRANSLATION_PROVIDERS = [
  {
    provide: TRANSLATION_PATH,
    useValue: '/assets/i18n/',
    multi: true,
  },
  {
    provide: TRANSLATION_PATH,
    useValue: '/assets/i18n/storybook-translations/page-header/',
    multi: true,
  }
]

@NgModule({
  exports: [TranslateModule],
  imports: [
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
      },
    }),
  ],
  providers: [
    provideAppStateServiceMock(),
    provideHttpClient(withInterceptorsFromDi()),
    ...STORYBOOK_TRANSLATION_PROVIDERS
  ],
})
export class StorybookTranslateModule {
  constructor(...args: unknown[])

  constructor() {
    const translateService = inject(TranslateService)
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
