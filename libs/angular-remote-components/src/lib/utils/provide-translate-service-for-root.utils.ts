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

/** 
 * @deprecated Should be removed. Use `provideTranslateService` of ngx-translate v17 instead:
 *
 * provideTranslateService({
 *  loader: provideTranslateLoader(OnecxTranslateLoader),
 *  missingTranslationHandler: provideMissingTranslationHandler(AngularMissingTranslationHandler)
 * })
 *
 * @see https://ngx-translate.org/getting-started/migration-guide/#important-correct-provider-usage
 * 
 */
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
