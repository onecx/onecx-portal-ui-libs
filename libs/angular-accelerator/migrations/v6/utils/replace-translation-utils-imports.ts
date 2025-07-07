import { Tree } from '@nx/devkit'
import { replaceImportValuesAndModule } from '@onecx/nx-migration-utils'

export function replaceTranslationUtilsImports(tree: Tree, srcDirectoryPath: string) {
  replaceImportValuesAndModule(tree, srcDirectoryPath, [
    {
      oldModuleSpecifier: '@onecx/angular-accelerator',
      newModuleSpecifier: '@onecx/angular-utils',
      valueReplacements: [
        {
          oldValue: 'createRemoteComponentTranslateLoader',
          newValue: 'createTranslateLoader',
        },
        {
          oldValue: 'createRemoteComponentAndMfeTranslateLoader',
          newValue: 'createTranslateLoader',
        },
        {
          oldValue: 'createTranslateLoader',
          newValue: 'createTranslateLoader',
        },
        {
          oldValue: 'TranslationCacheService',
          newValue: 'TranslationCacheService',
        },
        {
          oldValue: 'AsyncTranslateLoader',
          newValue: 'AsyncTranslateLoader',
        },
        {
          oldValue: 'CachingTranslateLoader',
          newValue: 'CachingTranslateLoader',
        },
        {
          oldValue: 'TranslateCombinedLoader',
          newValue: 'TranslateCombinedLoader',
        },
      ],
    },
  ])
}
