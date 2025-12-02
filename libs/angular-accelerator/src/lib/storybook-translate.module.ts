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
  A utility module adding i18N support for Storybook stories
 **/
@NgModule({
  exports: [TranslateModule],
  imports: [
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideAppStateServiceMock(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: TRANSLATION_PATH,
      useValue: './assets/i18n/',
      multi: true,
    }
  ],
})
export class StorybookTranslateModule {
  constructor(...args: unknown[])

  constructor() {
    const translateService = inject(TranslateService)
    translateService.setTranslation('en', {
      pageheader: {
        valueTooltip: 'Page Header Value Tooltip EN {{value}}',
        labelTooltip: 'Page Header Label Tooltip EN {{label}}',
        actionItemTooltip: 'Page Header Action Item Tooltip EN {{action}}',
      }
    }, true)
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
