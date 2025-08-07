import { Tree } from '@nx/devkit'
import { detectVariablesWithIdentifier } from '../../../utils/detection/detect-variables-with-identifier.utils'
import { Module } from '../../model/module.model'

/**
 * Detects variables that include the Angular module.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param module - the module to search for
 * @returns {string[]} a list of variable names that include the module
 */
export function detectVariablesWithModule(tree: Tree, rootDir: string, module: Module): string[] {
  return detectVariablesWithIdentifier(tree, rootDir, module.name)
}
