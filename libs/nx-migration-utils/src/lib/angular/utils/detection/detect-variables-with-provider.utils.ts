import { Tree } from '@nx/devkit'
import { detectVariablesWithIdentifier } from '../../../utils/detection/detect-variables-with-identifier.utils'
import { Provider } from '../../model/provider.model'

/**
 * Detects variables that include the Angular provider.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param provider - the provider to search for
 * @returns {string[]} a list of variable names that include the provider
 */
export function detectVariablesWithProvider(tree: Tree, rootDir: string, provider: Provider): string[] {
  return detectVariablesWithIdentifier(tree, rootDir, provider.name)
}
