import { Tree, logger } from '@nx/devkit'
import { addImportsIfDoNotExist, replaceImportValuesAndModule, updateNode } from '@onecx/nx-migration-utils'
import { CallExpression } from 'typescript'

export default async function replaceTranslationsUtils(tree: Tree) {
  const srcDirectoryPath = 'src'

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

  updateTranslationsForRemoteComponent(tree, srcDirectoryPath)
  updateTranslationsForMfe(tree, srcDirectoryPath)
}

function updateTranslationsForRemoteComponent(tree: Tree, dirPath: string) {
  const affectedFiles: string[] = []

  const providerQuery = 'CallExpression[expression.name="provideTranslateServiceForRoot"]'
  // only when provideTranslateServiceForRoot is imported from libs
  const filterQuery =
    'ImportDeclaration:has(Identifier[name=provideTranslateServiceForRoot]):has(StringLiteral[value=@onecx/angular-remote-components])'
  updateNode<CallExpression>(
    tree,
    dirPath,
    providerQuery,
    (_, filePath) => {
      affectedFiles.push(filePath)
      logger.warn(
        `⚠️ TRANSLATION_PATH has been added in ${filePath}. Please, make sure to adjust the path factory accordingly to your project.`
      )

      return `
      provideTranslateServiceForRoot({
        isolate: true,
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
        }
      }),
      {
        provide: TRANSLATION_PATH,
        useFactory: (remoteComponentConfig: ReplaySubject<RemoteComponentConfig>) =>
          remoteComponentTranslationPathFactory('assets/i18n/')(remoteComponentConfig),
        multi: true,
        deps: [REMOTE_COMPONENT_CONFIG]
      }`
    },
    filterQuery
  )

  affectedFiles.forEach((file) => {
    addImportsIfDoNotExist(tree, file, [
      {
        specifiers: ['ReplaySubject'],
        path: 'rxjs',
      },
      {
        specifiers: [
          'TRANSLATION_PATH',
          'RemoteComponentConfig',
          'remoteComponentTranslationPathFactory',
          'REMOTE_COMPONENT_CONFIG',
        ],
        path: '@onecx/angular-utils',
      },
    ])
  })
}

function updateTranslationsForMfe(tree: Tree, dirPath: string) {
  const affectedFiles: string[] = []

  // Update import
  updateNode<CallExpression>(
    tree,
    dirPath,
    'CallExpression[expression.expression.name=TranslateModule][expression.name.name=forRoot]:has(Identifier[name=createTranslateLoader])',
    () => {
      return `
      TranslateModule.forRoot({
        isolate: true,
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
        }
      })`
    },
    'ImportDeclaration:has(Identifier[name=createTranslateLoader]):has(StringLiteral[value=@onecx/angular-utils])'
  )

  // Add provider when import is used directly

  // Add provider when import is used via variable

  affectedFiles.forEach((file) => {
    addImportsIfDoNotExist(tree, file, [
      {
        specifiers: ['TRANSLATION_PATH', 'translationPathFactory'],
        path: '@onecx/angular-utils',
      },
    ])
  })
}
