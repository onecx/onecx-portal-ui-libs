import {
  DEFAULT_LANGUAGE,
  FakeMissingTranslationHandler,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateDefaultParser,
  TranslateFakeCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModuleConfig,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
} from '@ngx-translate/core'

export function provideTranslateServiceForRoot(config: TranslateModuleConfig = {}) {
  return [
    config.loader || { provide: TranslateLoader, useClass: TranslateFakeLoader },
    config.compiler || { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
    config.parser || { provide: TranslateParser, useClass: TranslateDefaultParser },
    config.missingTranslationHandler || { provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler },
    TranslateStore,
    { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
    { provide: USE_EXTEND, useValue: config.extend },
    { provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage },
    TranslateService,
  ]
}
