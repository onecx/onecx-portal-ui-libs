import { existsSync } from 'node:fs'
import path from 'node:path'
import { createProjectGraphAsync } from '@nx/devkit'
import { nxProjectSlices, projectFiles } from 'archunit'
import { dependenciesOf } from './dependency-graph'
import { tsConfig, workspaceRoot } from './workspace'

describe('Library dependencies', () => {
  // nxProjectSlices reads Nx's cached project graph. Recompute it so the rule never checks a stale or missing graph,
  // e.g. when the tests are started with jest directly instead of `nx run`.
  beforeAll(async () => {
    if (process.env['NX_WORKSPACE_DATA_DIRECTORY'] && !process.env['NX_PROJECT_GRAPH_CACHE_DIRECTORY']) {
      // ArchUnitTS only knows the variable used before Nx 19.2
      process.env['NX_PROJECT_GRAPH_CACHE_DIRECTORY'] = process.env['NX_WORKSPACE_DATA_DIRECTORY']
    }
    await createProjectGraphAsync({ exitOnError: false })
    const graphDirectory = path.resolve(
      workspaceRoot,
      process.env['NX_PROJECT_GRAPH_CACHE_DIRECTORY'] ?? '.nx/workspace-data'
    )
    if (!existsSync(path.join(graphDirectory, 'project-graph.json'))) {
      throw new Error(`Nx project graph not found in ${graphDirectory}`)
    }
  })

  it('should only contain the dependencies between projects allowed in library-dependencies.puml', async () => {
    const rule = nxProjectSlices(workspaceRoot)
      .should()
      .ignoringExternalDependencies()
      .adhereToDiagramInFile(path.join(__dirname, 'library-dependencies.puml'))

    await expect(rule).toPassAsync()
  })

  // Covered by the diagram as well, but kept explicit on file level: React apps must never pull in Angular and vice versa.
  it('should not let React libraries depend on Angular or NgRx libraries', async () => {
    const rule = projectFiles(tsConfig)
      .inPath(/^libs\/react-/)
      .should()
      .adhereTo(
        (file) => !dependenciesOf(file.path).files.some((target) => /^libs\/(angular|ngrx)-/.test(target)),
        'must not import files of Angular or NgRx libraries'
      )

    await expect(rule).toPassAsync()
  })

  it('should not let Angular or NgRx libraries depend on React libraries', async () => {
    const rule = projectFiles(tsConfig)
      .inPath(/^libs\/(angular|ngrx)-/)
      .should()
      .adhereTo(
        (file) => !dependenciesOf(file.path).files.some((target) => /^libs\/react-/.test(target)),
        'must not import files of React libraries'
      )

    await expect(rule).toPassAsync()
  })
})
