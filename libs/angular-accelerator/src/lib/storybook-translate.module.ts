import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { NgModule } from '@angular/core'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { registerLocaleData } from '@angular/common'
import localeDE from '@angular/common/locales/de'
import { createTranslateLoader, TRANSLATION_PATH } from '@onecx/angular-utils'
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
  constructor(translateService: TranslateService) {
    translateService.setTranslation('en', {
      pageheader: {
        valueTooltip: 'Page Header Value Tooltip EN',
        labelTooltip: 'Page Header Label Tooltip EN',
        actionItemTooltip: 'Page Header Action Item Tooltip EN',
        actionItemAriaLabel: 'Page Header Action Item Aria Label EN',
        statusLabelTooltip: 'Status Label Tooltip EN (status: {{status}})',
        statusValueTooltip: 'Status Value Tooltip EN (value: {{value}})',
      }
    }, true)
    translateService.setTranslation('de', {
      pageheader: {
        valueTooltip: 'Page Header Value Tooltip DE',
        labelTooltip: 'Page Header Label Tooltip DE',
        actionItemTooltip: 'Page Header Action Item Tooltip DE',
        actionItemAriaLabel: 'Page Header Action Item Aria Label DE',
        statusLabelTooltip: 'Status Label Tooltip DE (status: {{status}})',
        statusValueTooltip: 'Status Value Tooltip DE (value: {{value}})',
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
