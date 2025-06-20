import { formatFiles, Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { removeImportValuesFromModule } from '@onecx/nx-migration-utils'
import { replace } from '@phenomnomnominal/tsquery'
import { CallExpression, ScriptKind } from 'typescript'

export default async function removeAddInitializeModuleGuard(tree: Tree) {
  const ngModuleQuery = 'Decorator > CallExpression:has(Identifier[name="NgModule"])'
  removeImportValuesFromModule(
    tree,
    'src',
    '@onecx/angular-integration-interface',
    'addInitializeModuleGuard',
    ngModuleQuery
  )
  removeImportValuesFromModule(
    tree,
    'src',
    '@onecx/portal-integration-angular',
    'addInitializeModuleGuard',
    ngModuleQuery
  )

  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('.ts')) return

    const content = tree.read(filePath, 'utf-8')
    if (!content) return

    const updated = replace(
      content,
      'CallExpression > CallExpression:has(Identifier[name="addInitializeModuleGuard"])',
      (node) => {
        const callExpressionNode = node as CallExpression
        const [expression] = callExpressionNode.arguments
        return expression.getText()
      },
      ScriptKind.TS
    )

    if (updated !== content) {
      tree.write(filePath, updated)
    }
  })

  await formatFiles(tree)
}
