import { Tree, logger } from '@nx/devkit'
import { addImportsIfDoNotExist, updateNode } from '@onecx/nx-migration-utils'
import { CallExpression } from 'typescript'

const RC_TRANSLATION_SERVICE_CALL = 'CallExpression[expression.name="provideTranslateServiceForRoot"]'
const RC_TRANSLATION_SERVICE_IMPORT =
  'ImportDeclaration:has(Identifier[name=provideTranslateServiceForRoot]):has(StringLiteral[value=@onecx/angular-remote-components])'

export function updateTranslationsForRemoteComponent(tree: Tree, dirPath: string) {
  const affectedFiles: string[] = []

  updateNode<CallExpression>(
    tree,
    dirPath,
    RC_TRANSLATION_SERVICE_CALL,
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
    RC_TRANSLATION_SERVICE_IMPORT
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
