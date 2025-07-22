import { Tree } from "@nx/devkit"
import { replace } from "@phenomnomnominal/tsquery"
import { isCallExpression, isObjectLiteralExpression, isPropertyAssignment, isStringLiteral, ScriptKind } from "typescript"

export function updateTranslationPathProvider(fileContent: string) {
    // replacement of provider usages
    const providerQuery = `ObjectLiteralExpression:has(PropertyAssignment:has(Identifier[name='provide'])):has(PropertyAssignment:has(Identifier[name='useValue'])), ObjectLiteralExpression:has(PropertyAssignment:has(Identifier[name='provide'])):has(PropertyAssignment:has(Identifier[name='useFactory']))`
    if (fileContent) {
      fileContent = replace(
        fileContent,
        providerQuery,
        (node) => {
          let path = 'assets/i18n/'
          if (isObjectLiteralExpression(node)) {
            for (const prop of node.properties) {
              if (isPropertyAssignment(prop)) {
                if (prop.name.getText() === 'useValue' && isStringLiteral(prop.initializer)) {
                  path = prop.initializer.text
                } else if (prop.name.getText() === 'useFactory' && isCallExpression(prop.initializer)) {
                  const args = prop.initializer.arguments
                  if (args.length > 0 && isStringLiteral(args[0])) {
                    path = args[0].text
                  }
                }
              }
            }
          }
          // Remove leading './' or '/' if present, ensure trailing slash
          path = path.replace(/^\.?\//, '').replace(/\/$/, '') + '/'
          return `provideTranslationPathFromMeta(import.meta.url, '${path}')`
        },
        ScriptKind.TS
      )
    }

    return fileContent;
}