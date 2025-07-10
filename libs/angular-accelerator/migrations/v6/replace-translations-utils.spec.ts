import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree, logger } from '@nx/devkit'
import replaceTranslationsUtils from './replace-translations-utils'

describe('replace-translations-utils', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
    jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
  })

  it('should update for RC', async () => {
    const filePath = 'src/app/main.ts'
    tree.write(
      filePath,
      `
    import { HttpClient } from "@angular/common/http";
    import { TranslateLoader } from "@ngx-translate/core";
    import { ReplaySubject } from "rxjs";
    import { createRemoteComponentTranslateLoader } from "@onecx/angular-accelerator";
    import {
        provideTranslateServiceForRoot
    } from "@onecx/angular-remote-components";
    import {
        REMOTE_COMPONENT_CONFIG
    } from "@onecx/angular-utils";

    @Component({
        providers: [
            provideTranslateServiceForRoot({
                isolate: true,
                loader: {
                    provide: TranslateLoader,
                    useFactory: createRemoteComponentTranslateLoader,
                    deps: [HttpClient, REMOTE_COMPONENT_CONFIG]
                }
            })
        ]
    })
    export class Component { }`
    )
    await replaceTranslationsUtils(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    import { HttpClient } from "@angular/common/http";
    import { TranslateLoader } from "@ngx-translate/core";
    import { ReplaySubject } from "rxjs";
    import {
        provideTranslateServiceForRoot
    } from "@onecx/angular-remote-components";
    import {
        REMOTE_COMPONENT_CONFIG,
        createTranslateLoader,
        TRANSLATION_PATH,
        RemoteComponentConfig,
        remoteComponentTranslationPathFactory
    } from "@onecx/angular-utils";

    @Component({
        providers: [
            provideTranslateServiceForRoot({
                isolate: true,
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [HttpClient]
                }
            }),
            {
                provide: TRANSLATION_PATH,
                useFactory: (remoteComponentConfig: ReplaySubject<RemoteComponentConfig>) =>
                  remoteComponentTranslationPathFactory('assets/i18n/')(remoteComponentConfig),
                multi: true,
                deps: [REMOTE_COMPONENT_CONFIG]
            }
        ]
    })
    export class Component { }`)
  })

  it('should update for RC with mfe loader', async () => {
    const filePath = 'src/app/main.ts'
    tree.write(
      filePath,
      `
        import { HttpClient } from "@angular/common/http";
        import { TranslateLoader } from "@ngx-translate/core";
        import { ReplaySubject } from "rxjs";
        import { createRemoteComponentAndMfeTranslateLoader } from "@onecx/angular-accelerator";
        import {
            provideTranslateServiceForRoot
        } from "@onecx/angular-remote-components";
        import {
            REMOTE_COMPONENT_CONFIG
        } from "@onecx/angular-utils";

        @Component({
            providers: [
                provideTranslateServiceForRoot({
                    isolate: true,
                    loader: {
                        provide: TranslateLoader,
                        useFactory: createRemoteComponentAndMfeTranslateLoader,
                        deps: [HttpClient, REMOTE_COMPONENT_CONFIG]
                    }
                })
            ]
        })
        export class Component { }`
    )
    await replaceTranslationsUtils(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { HttpClient } from "@angular/common/http";
      import { TranslateLoader } from "@ngx-translate/core";
      import { ReplaySubject } from "rxjs";
      import {
          provideTranslateServiceForRoot
      } from "@onecx/angular-remote-components";
      import {
          REMOTE_COMPONENT_CONFIG,
          createTranslateLoader,
          TRANSLATION_PATH,
          RemoteComponentConfig,
          remoteComponentTranslationPathFactory
      } from "@onecx/angular-utils";

      @Component({
          providers: [
              provideTranslateServiceForRoot({
                  isolate: true,
                  loader: {
                      provide: TranslateLoader,
                      useFactory: createTranslateLoader,
                      deps: [HttpClient]
                  }
              }),
              {
                  provide: TRANSLATION_PATH,
                  useFactory: (remoteComponentConfig: ReplaySubject<RemoteComponentConfig>) =>
                    remoteComponentTranslationPathFactory('assets/i18n/')(remoteComponentConfig),
                  multi: true,
                  deps: [REMOTE_COMPONENT_CONFIG]
              }
          ]
      })
      export class Component { }
      `)
  })

  it('should update for RC when BASE_URL is defined', async () => {
    const filePath = 'src/app/main.ts'
    tree.write(
      filePath,
      `
        import { HttpClient } from "@angular/common/http";
        import { TranslateLoader } from "@ngx-translate/core";
        import { ReplaySubject } from "rxjs";
        import { createRemoteComponentAndMfeTranslateLoader } from "@onecx/angular-accelerator";
        import {
            provideTranslateServiceForRoot,
            BASE_URL
        } from "@onecx/angular-remote-components";

        @Component({
            providers: [
                provideTranslateServiceForRoot({
                    isolate: true,
                    loader: {
                        provide: TranslateLoader,
                        useFactory: createRemoteComponentAndMfeTranslateLoader,
                        deps: [HttpClient, BASE_URL]
                    }
                })
            ]
        })
        export class Component { }`
    )
    await replaceTranslationsUtils(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { HttpClient } from "@angular/common/http";
      import { TranslateLoader } from "@ngx-translate/core";
      import { ReplaySubject } from "rxjs";
      import {
          createTranslateLoader,
          TRANSLATION_PATH,
          RemoteComponentConfig,
          remoteComponentTranslationPathFactory,
          REMOTE_COMPONENT_CONFIG
      } from "@onecx/angular-utils";
      import {
          provideTranslateServiceForRoot,
          BASE_URL
      } from "@onecx/angular-remote-components";

      @Component({
          providers: [
              provideTranslateServiceForRoot({
                  isolate: true,
                  loader: {
                      provide: TranslateLoader,
                      useFactory: createTranslateLoader,
                      deps: [HttpClient]
                  }
              }),
              {
                  provide: TRANSLATION_PATH,
                  useFactory: (remoteComponentConfig: ReplaySubject<RemoteComponentConfig>) =>
                    remoteComponentTranslationPathFactory('assets/i18n/')(remoteComponentConfig),
                  multi: true,
                  deps: [REMOTE_COMPONENT_CONFIG]
              }
          ]
      })
      export class Component { }
      `)
  })

  it('should update for mfe', async () => {
    const filePath = 'src/app/main.ts'
    tree.write(
      filePath,
      `
      import { HttpClient } from "@angular/common/http";
      import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
      import { createTranslateLoader } from "@onecx/angular-accelerator";
      import { AppStateService } from "@onecx/angular-integration-interface";

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
      export class AppModule { }`
    )
    await replaceTranslationsUtils(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { HttpClient } from "@angular/common/http";
      import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
      import { createTranslateLoader, TRANSLATION_PATH, translationPathFactory } from "@onecx/angular-utils";
      import { AppStateService } from "@onecx/angular-integration-interface";

      @NgModule({
      imports: [
          TranslateModule.forRoot({
              isolate: true,
              loader: {
                  provide: TranslateLoader,
                  useFactory: createTranslateLoader,
                  deps: [HttpClient]
              }
          })
      ],
      providers: [
          {
              provide: TRANSLATION_PATH,
              useFactory: (appStateService: AppStateService) =>
                translationPathFactory('assets/i18n/')(appStateService),
              multi: true,
              deps: [AppStateService]
          }
      ]
      })
      export class AppModule { }`)
  })

  it('should update for mfe when defined in commonImports', async () => {
    const commonPath = 'src/app/common.ts'
    tree.write(
      commonPath,
      `
        import { HttpClient } from "@angular/common/http";
        import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
        import { createTranslateLoader } from "@onecx/angular-accelerator";
        import { AppStateService } from "@onecx/angular-integration-interface";

        export const commonImports = [
            TranslateModule.forRoot({
                isolate: true,
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [HttpClient, AppStateService]
                }
            })
        ];`
    )

    const mainPath = 'src/app/main.ts'

    tree.write(
      mainPath,
      `
      import { commonImports } from "./common";

      @NgModule({
      imports: [
          ...commonImports
      ]
      })
      export class AppModule { }`
    )
    await replaceTranslationsUtils(tree)

    const commonContent = tree.read(commonPath)?.toString()

    expect(commonContent).toEqualIgnoringWhitespace(`
    import { HttpClient } from "@angular/common/http";
    import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
    import { createTranslateLoader } from "@onecx/angular-utils";
    import { AppStateService } from "@onecx/angular-integration-interface";

    export const commonImports = [
        TranslateModule.forRoot({
            isolate: true,
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ];`)

    const mainContent = tree.read(mainPath)?.toString()

    expect(mainContent).toEqualIgnoringWhitespace(`
    import { AppStateService } from "@onecx/angular-integration-interface";
    import { TRANSLATION_PATH, translationPathFactory } from "@onecx/angular-utils";
      import { commonImports } from "./common";

      @NgModule({
        imports: [
          ...commonImports
        ],
        providers: [
            {
                provide: TRANSLATION_PATH,
                useFactory: (appStateService: AppStateService) =>
                translationPathFactory('assets/i18n/')(appStateService),
                multi: true,
                deps: [AppStateService]
            }
        ]
      })
      export class AppModule { }`)
  })
  it('should update for mfe when commonImports uses exported variable from common-onecx.ts', async () => {
    const commonOnecxPath = 'src/app/common-onecx.ts'
    tree.write(
      commonOnecxPath,
      `import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
       import { HttpClient } from "@angular/common/http";
       import { createTranslateLoader } from "@onecx/angular-accelerator";
       import { AppStateService } from "@onecx/angular-integration-interface";

       export const commonOnecx = [
            TranslateModule.forRoot({
                isolate: true,
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [HttpClient, AppStateService]
                }
            })
        ]`
    )

    tree.write(
      'src/app/common.ts',
      `import { commonOnecx } from "./common-onecx";

       export const commonImports = [
        ...commonOnecx
       ];`
    )

    const mainPath = 'src/app/main.ts'

    tree.write(
      mainPath,
      `import { commonImports } from "./common";

       @NgModule({
         imports: [
           ...commonImports
         ]
       })
       export class AppModule { }`
    )

    await replaceTranslationsUtils(tree)

    const commonOnecxContent = tree.read('src/app/common-onecx.ts')?.toString()

    expect(commonOnecxContent).toEqualIgnoringWhitespace(`
      import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
      import { HttpClient } from "@angular/common/http";
      import { createTranslateLoader } from "@onecx/angular-utils";
      import { AppStateService } from "@onecx/angular-integration-interface";

      export const commonOnecx = [
            TranslateModule.forRoot({
                isolate: true,
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [HttpClient]
                }
            })
        ];`)

    const mainContent = tree.read(mainPath)?.toString()

    expect(mainContent).toEqualIgnoringWhitespace(`
      import { AppStateService } from "@onecx/angular-integration-interface";
      import { TRANSLATION_PATH, translationPathFactory } from "@onecx/angular-utils";
      import { commonImports } from "./common";

        @NgModule({
            imports: [
            ...commonImports
            ],
            providers: [
                {
                    provide: TRANSLATION_PATH,
                    useFactory: (appStateService: AppStateService) =>
                    translationPathFactory('assets/i18n/')(appStateService),
                    multi: true,
                    deps: [AppStateService]
                }
            ]
        })
        export class AppModule { }`)
  })

  it('should update imports', async () => {
    const filePath = 'src/app/main.ts'
    tree.write(
      filePath,
      `
      import { TranslationCacheService, AsyncTranslateLoader, CachingTranslateLoader, TranslateCombinedLoader } from "@onecx/angular-accelerator";`
    )
    await replaceTranslationsUtils(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { TranslationCacheService, AsyncTranslateLoader, CachingTranslateLoader, TranslateCombinedLoader } from "@onecx/angular-utils";`)
  })
})
