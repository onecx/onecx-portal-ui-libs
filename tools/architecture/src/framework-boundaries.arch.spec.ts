import { projectFiles } from 'archunit'
import { dependenciesOf } from './dependency-graph'
import { tsConfig } from './workspace'

// npm packages are not part of the ArchUnitTS graph, the imported package names come from the parsed module specifiers.
const importsPackage = (pattern: RegExp) => (file: { path: string }) =>
  dependenciesOf(file.path).packages.some((name) => pattern.test(name))
const importsAngular = importsPackage(/^@(angular|ngrx)\//)
const importsReact = importsPackage(/^react(-dom)?$/)

describe('Framework boundaries', () => {
  // accelerator and integration-interface are shared by the Angular and the React libraries.
  it('should keep the core libraries free of Angular and NgRx', async () => {
    const rule = projectFiles(tsConfig)
      .inPath(/^libs\/(accelerator|integration-interface)\//)
      .should()
      .adhereTo((file) => !importsAngular(file), 'must not import @angular/* or @ngrx/*')

    await expect(rule).toPassAsync()
  })

  it('should keep the core libraries free of React', async () => {
    const rule = projectFiles(tsConfig)
      .inPath(/^libs\/(accelerator|integration-interface)\//)
      .should()
      .adhereTo((file) => !importsReact(file), 'must not import react or react-dom')

    await expect(rule).toPassAsync()
  })

  it('should not import Angular or NgRx in React libraries', async () => {
    const rule = projectFiles(tsConfig)
      .inPath(/^libs\/react-/)
      .should()
      .adhereTo((file) => !importsAngular(file), 'must not import @angular/* or @ngrx/*')

    await expect(rule).toPassAsync()
  })

  it('should not import React in Angular or NgRx libraries', async () => {
    const rule = projectFiles(tsConfig)
      .inPath(/^libs\/(angular|ngrx)-/)
      .should()
      .adhereTo((file) => !importsReact(file), 'must not import react or react-dom')

    await expect(rule).toPassAsync()
  })
})
