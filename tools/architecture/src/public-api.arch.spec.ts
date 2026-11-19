import path from 'node:path'
import { projectFiles } from 'archunit'
import { dependenciesOf, dependencyGraph } from './dependency-graph'
import { escapeRegExp, exactly, libraries, libraryOf, publicEntryPoints, tsConfig } from './workspace'

/**
 * Files that import the barrel of their own entry point. They are part of a known import cycle (see cycles.arch.spec.ts),
 * remove them here when the cycle is fixed.
 */
const knownOwnEntryPointImports = [
  'libs/angular-utils/style/src/utils/app-styles-lifecycle.utils.ts',
  'libs/angular-utils/style/src/utils/app-styles-scope.utils.ts',
  'libs/angular-utils/style/src/utils/app-styles-usage.utils.ts',
  'libs/angular-utils/style/src/utils/dom-style.utils.ts',
]

describe('Public API', () => {
  // Deep imports (relative paths or `@onecx/<lib>/src/...`, also via `export ... from` or `import()`) bypass the package
  // exports and break once the library is consumed as a published package.
  it.each(libraries)('should only use other libraries through their public entry points: %s', async (lib) => {
    const rule = projectFiles(tsConfig)
      .inPath(new RegExp(`^libs/${escapeRegExp(lib)}/`))
      .should()
      .adhereTo(
        (file) =>
          dependenciesOf(file.path).files.every(
            (target) => [undefined, lib].includes(libraryOf(target)) || publicEntryPoints.includes(target)
          ),
        'must only import other libraries through their public entry points (@onecx/<lib> or a secondary entry point)'
      )

    await expect(rule).toPassAsync()
  })

  // Importing the own barrel (`@onecx/<lib>`, `../index`) from code behind that entry point creates import cycles
  // through index.ts. Applies to the primary and the secondary entry points (e.g. @onecx/angular-utils/style).
  const entryPointsWithCode = publicEntryPoints.filter((entryPoint) => {
    const folder = `${path.posix.dirname(entryPoint)}/`
    return [...dependencyGraph().keys()].some((file) => file.startsWith(folder) && file !== entryPoint)
  })

  it.each(entryPointsWithCode)('should not import the own entry point from code behind it: %s', async (entryPoint) => {
    const rule = projectFiles(tsConfig)
      .inPath(new RegExp(`^${escapeRegExp(path.posix.dirname(entryPoint))}/`), {
        except: { inPath: [entryPoint, ...knownOwnEntryPointImports].map(exactly) },
      })
      .should()
      .adhereTo(
        (file) => !dependenciesOf(file.path).files.includes(entryPoint),
        `must not import ${entryPoint}, import the file that declares the symbol instead`
      )

    await expect(rule).toPassAsync()
  })
})
