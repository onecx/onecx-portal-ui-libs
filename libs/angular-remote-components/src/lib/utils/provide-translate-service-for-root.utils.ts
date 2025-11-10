import {
  TranslateDefaultParser,
  TranslateModuleConfig,
  defaultProviders,
  provideTranslateCompiler,
  provideTranslateParser,
  provideTranslateLoader,
  DefaultMissingTranslationHandler,
  TranslateNoOpCompiler,
  TranslateNoOpLoader,
  provideMissingTranslationHandler,
} from '@ngx-translate/core'

export function provideTranslateServiceForRoot(config: TranslateModuleConfig = {}) {
  return [...defaultProviders(
    {
      compiler: provideTranslateCompiler(TranslateNoOpCompiler),
      parser: provideTranslateParser(TranslateDefaultParser),
      loader: provideTranslateLoader(TranslateNoOpLoader),
      missingTranslationHandler: provideMissingTranslationHandler(
        DefaultMissingTranslationHandler,
      ),
      ...config,
    },
    true,
  )]
}
