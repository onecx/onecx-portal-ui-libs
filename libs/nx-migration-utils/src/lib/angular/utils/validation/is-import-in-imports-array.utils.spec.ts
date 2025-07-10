import { isImportInImportsArray } from './is-import-in-imports-array.utils'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'

describe('isImportInImportsArray', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should validate if a module contains an import in the imports array', () => {
    const moduleContent = `
      import { NgModule } from '@angular/core';
      import { MyDummyModule } from 'package';

      @NgModule({
        imports: [MyDummyModule],
        declarations: []
      })
      export class AppModule {}
    `

    tree.write('apps/app/src/app.module.ts', moduleContent)

    const result = isImportInImportsArray(tree, 'apps/app/src/app.module.ts', 'MyDummyModule')

    expect(result).toBe(true)
  })

  it('should validate if a module contains an import with a specific source', () => {
    const moduleContent = `
      import { NgModule } from '@angular/core';
      import { TranslateModule } from '@ngx-translate/core';
      import { createTranslateLoader } from '@onecx/angular-utils';

      @NgModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient]
            }
          })
        ],
        declarations: []
      })
      export class AppModule {}
    `

    tree.write('apps/app/src/app.module.ts', moduleContent)

    const result = isImportInImportsArray(tree, 'apps/app/src/app.module.ts', 'TranslateModule', {
      importSource: '@ngx-translate/core',
      importArrayQueries: [
        'CallExpression:has(PropertyAssignment[name.name="loader"] Identifier[name="createTranslateLoader"])',
      ],
      globalQueries: [
        'ImportDeclaration:has(StringLiteral[value="@onecx/angular-utils"]) ImportSpecifier:has(Identifier[name="createTranslateLoader"])',
      ],
    })

    expect(result).toBe(true)
  })

  it('should validate if a module contains an import with a specific source and nested queries', () => {
    const moduleContent = `
      import { NgModule } from '@angular/core';
      import { TranslateModule } from '@ngx-translate/core';
      import { createTranslateLoader } from '@onecx/angular-utils';

      @NgModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient]
            }
          })
        ],
        declarations: []
      })
      export class AppModule {}
    `

    tree.write('apps/app/src/app.module.ts', moduleContent)

    const result = isImportInImportsArray(tree, 'apps/app/src/app.module.ts', 'TranslateModule', {
      importSource: '@ngx-translate/core',
      importArrayQueries: [
        'CallExpression:has(PropertyAssignment[name.name="loader"] Identifier[name="createTranslateLoader"])',
      ],
    })

    expect(result).toBe(true)
  })

  it('should validate if a module contains an import with additional global queries', () => {
    const moduleContent = `
      import { NgModule } from '@angular/core';
      import { MyDummyModule } from 'package';
      import { SomeGlobalService } from 'global-service';
      import { GlobalConfig } from 'global-config';

      @NgModule({
        imports: [MyDummyModule],
        declarations: []
      })
      export class AppModule {}
`

    tree.write('apps/app/src/app.module.ts', moduleContent)

    const result = isImportInImportsArray(tree, 'apps/app/src/app.module.ts', 'MyDummyModule', {
      globalQueries: ['ImportDeclaration:has(Identifier[name="SomeGlobalService"])'],
    })

    expect(result).toBe(true)
  })

  it('should validate if a specific class contains an import', () => {
    const moduleContent = `
      import { NgModule } from '@angular/core';
      import { MyDummyModule } from 'package';

      @NgModule({
        imports: [MyDummyModule],
        declarations: []
      })
      export class SpecificModule {}

      @NgModule({
        imports: [],
        declarations: []
      })
      export class AnotherModule {}
    `

    tree.write('apps/app/src/app.module.ts', moduleContent)

    const result = isImportInImportsArray(tree, 'apps/app/src/app.module.ts', 'MyDummyModule', {
      className: 'SpecificModule',
    })

    expect(result).toBe(true)
  })

  it('should return false if the import is not found in the imports array', () => {
    const moduleContent = `
      import { NgModule } from '@angular/core';

      @NgModule({
        imports: [],
        declarations: []
      })
      export class AppModule {}
    `

    tree.write('apps/app/src/app.module.ts', moduleContent)

    const result = isImportInImportsArray(tree, 'apps/app/src/app.module.ts', 'NonExistentModule')

    expect(result).toBe(false)
  })

  it('should return false if the import source does not match', () => {
    const moduleContent = `
      import { NgModule } from '@angular/core';
      import { MyDummyModule } from 'another-package';

      @NgModule({
        imports: [MyDummyModule],
        declarations: []
      })
      export class AppModule {}
    `

    tree.write('apps/app/src/app.module.ts', moduleContent)

    const result = isImportInImportsArray(tree, 'apps/app/src/app.module.ts', 'MyDummyModule', {
      importSource: 'package',
    })

    expect(result).toBe(false)
  })
})
