import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

export const workspaceRoot = path.resolve(__dirname, '../../..')

// All import paths are resolved with the workspace path aliases (@onecx/...), file paths in rules are relative to the root.
export const tsConfig = path.join(workspaceRoot, 'tsconfig.base.json')

/** Folder names of all Nx library projects in libs/. */
export const libraries = readdirSync(path.join(workspaceRoot, 'libs')).filter((lib) =>
  existsSync(path.join(workspaceRoot, 'libs', lib, 'project.json'))
)

/** Files the @onecx/... path aliases point to, i.e. the public entry points of the libraries (incl. secondary ones). */
export const publicEntryPoints: string[] = Object.values<string[]>(
  JSON.parse(readFileSync(tsConfig, 'utf8')).compilerOptions.paths
)
  .flat()
  .filter((file) => file.startsWith('libs/'))

/** Code that is only used by tests and Storybook, never by the published runtime code. */
export const testCode: RegExp[] = [
  /\.(spec|test)\.tsx?$/,
  /\.stories\.tsx?$/,
  /\.harness\.ts$/,
  /\/test-setup\.ts$/,
  /\/jest\.config\.c?ts$/,
  /storybook/,
  /\/mocks\//,
  /\/testing\//,
  /^libs\/angular-testing\//,
]

export const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Matches exactly the given workspace-relative file path. */
export const exactly = (file: string) => new RegExp(`^${escapeRegExp(file)}$`)

export const isTestCode = (file: string) => testCode.some((pattern) => pattern.test(file))

/** Library folder name of a workspace-relative path in libs/, e.g. `angular-utils` for `libs/angular-utils/style/...`. */
export const libraryOf = (file: string) => (file.startsWith('libs/') ? file.split('/')[1] : undefined)
