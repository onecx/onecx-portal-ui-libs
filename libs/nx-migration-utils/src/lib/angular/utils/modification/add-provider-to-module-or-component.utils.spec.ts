import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { addProviderToModuleOrComponent } from './add-provider-to-module-or-component.utils'

describe('addProviderToModuleOrComponent', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should add a simple provider to an existing providers array', () => {
    const filePath = 'src/app/app.module.ts'
    tree.write(
      filePath,
      `
      @NgModule({
        providers: [ExistingProvider]
      })
      export class AppModule {}
      `
    )

    addProviderToModuleOrComponent(tree, filePath, 'NewProvider')

    const content = tree.read(filePath, 'utf-8')
    expect(content).toContain('providers: [ExistingProvider, NewProvider]')
  })

  it('should create a providers array if none exists', () => {
    const filePath = 'src/app/app.module.ts'
    tree.write(
      filePath,
      `
      @NgModule({})
      export class AppModule {}
      `
    )

    addProviderToModuleOrComponent(tree, filePath, 'NewProvider')

    const content = tree.read(filePath, 'utf-8')
    expect(content).toContain('providers: [NewProvider]')
  })

  it('should add a provider with a function call', () => {
    const filePath = 'src/app/app.module.ts'
    tree.write(
      filePath,
      `
      @NgModule({
        providers: []
      })
      export class AppModule {}
      `
    )

    addProviderToModuleOrComponent(tree, filePath, 'provideAppStateServiceMock()')

    const content = tree.read(filePath, 'utf-8')
    expect(content).toContain('providers: [provideAppStateServiceMock()]')
  })

  it('should add a provider with an object configuration', () => {
    const filePath = 'src/app/app.module.ts'
    tree.write(
      filePath,
      `
      @NgModule({
        providers: []
      })
      export class AppModule {}
      `
    )

    addProviderToModuleOrComponent(
      tree,
      filePath,
      `{
        provide: SKIP_STYLE_SCOPING,
        useValue: true
      }`
    )

    const content = tree.read(filePath, 'utf-8')
    expect(content).toEqualIgnoringWhitespace(`
      @NgModule({
        providers: [
          {
            provide: SKIP_STYLE_SCOPING,
            useValue: true
          }
        ]
      })
      export class AppModule {}
    `)
  })

  it('should add a complex provider with multiple properties', () => {
    const filePath = 'src/app/app.module.ts'
    tree.write(
      filePath,
      `
      @NgModule({
        providers: []
      })
      export class AppModule {}
      `
    )

    addProviderToModuleOrComponent(
      tree,
      filePath,
      `{
        provide: APP_INITIALIZER,
        useFactory: permissionProxyInitializer,
        deps: [PermissionProxyService],
        multi: true
      }`
    )

    const content = tree.read(filePath, 'utf-8')
    expect(content).toEqualIgnoringWhitespace(`
      @NgModule({
        providers: [
          {
            provide: APP_INITIALIZER,
            useFactory: permissionProxyInitializer,
            deps: [PermissionProxyService],
            multi: true
          }
        ]
      })
      export class AppModule {}
    `)
  })

  it('should add a provider when multiple ObjectLiteralExpressions exist', () => {
    const filePath = 'src/app/app.module.ts'
    tree.write(
      filePath,
      `
      @NgModule({
        imports: [
          TranslateModule.forRoot({
            isolate: true,
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient, AppStateService]
            }
          })
        ]
      })
      export class AppModule {}
      `
    )

    addProviderToModuleOrComponent(tree, filePath, `MyService`)

    const content = tree.read(filePath, 'utf-8')
    expect(content).toEqualIgnoringWhitespace(`
      @NgModule({
        imports: [
          TranslateModule.forRoot({
            isolate: true,
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient, AppStateService]
            }
          })
        ],
        providers: [MyService]
      })
      export class AppModule {}
    `)
  })

  it('should add an import to the file when importsToAdd is provided', () => {
    const filePath = 'src/app/app.module.ts'
    tree.write(
      filePath,
      `
      @NgModule({
        imports: []
      })
      export class AppModule {}
      `
    )

    addProviderToModuleOrComponent(tree, filePath, 'HttpClient', {
      importsToAdd: [{ specifier: 'HttpClient', path: '@angular/common/http' }],
    })

    const content = tree.read(filePath, 'utf-8')
    expect(content).toEqualIgnoringWhitespace(`
      import { HttpClient } from "@angular/common/http";

      @NgModule({
        imports: [],
        providers: [HttpClient]
      })
      export class AppModule {}
    `)
  })
})
