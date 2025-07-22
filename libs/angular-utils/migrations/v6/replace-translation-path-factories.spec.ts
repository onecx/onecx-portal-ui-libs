import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import replaceTranslationPathFactories from './replace-translation-path-factories'

describe('replace-translation-path-factories', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should replace provider with remoteComponentTranslationPathFactory with provideTranslationPathFromMeta', async () => {
    const filePath = 'src/app/main.ts'
    tree.write(
      filePath,
      `
    import { bootstrapRemoteComponent } from '@onecx/angular-webcomponents';
    import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig, provideTranslateServiceForRoot } from '@onecx/angular-remote-components';
    import { TranslateLoader } from '@ngx-translate/core';
    import { ReplaySubject } from 'rxjs';
    import { TRANSLATION_PATH, createTranslateLoader, remoteComponentTranslationPathFactory } from '@onecx/angular-utils';

    bootstrapRemoteComponent(RemoteComponent, 'ocx-my-remote-component', environment.production, [
        { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) },
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
            remoteComponentTranslationPathFactory('path/i18n/')(remoteComponentConfig),
            multi: true,
            deps: [REMOTE_COMPONENT_CONFIG]
        },
    ]);`
    )
    await replaceTranslationPathFactories(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    import { bootstrapRemoteComponent } from '@onecx/angular-webcomponents';
    import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig, provideTranslateServiceForRoot } from '@onecx/angular-remote-components';
    import { TranslateLoader } from '@ngx-translate/core';
    import { ReplaySubject } from 'rxjs';
    import { createTranslateLoader, provideTranslationPathFromMeta } from '@onecx/angular-utils';

    bootstrapRemoteComponent(RemoteComponent, 'ocx-my-remote-component', environment.production, [
        { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) },
        provideTranslateServiceForRoot({
            isolate: true,
            loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
            }
        }),
        provideTranslationPathFromMeta(import.meta.url, 'path/i18n/'),
    ]);
    `
    )
  })

  it('should replace provider with translationPathFactory with provideTranslationPathFromMeta', async () => {
    const filePath = 'src/app/main.ts'
    tree.write(
      filePath,
      `
    import { TRANSLATION_PATH, createTranslateLoader, translationPathFactory } from '@onecx/angular-utils';
    import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
    import { AppStateService } from '@onecx/angular-integration-interface';

    @NgModule()
    providers: [
      {
        provide: TRANSLATION_PATH,
        useFactory: (appStateService: AppStateService) => translationPathFactory('assets/i18n/')(appStateService),
        multi: true,
        deps: [AppStateService]
      },
        provideHttpClient(withInterceptorsFromDi()),
    ];`
    )
    await replaceTranslationPathFactories(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    import { createTranslateLoader, provideTranslationPathFromMeta } from '@onecx/angular-utils';
    import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
    import { AppStateService } from '@onecx/angular-integration-interface';

    @NgModule()
    providers: [
      provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
      provideHttpClient(withInterceptorsFromDi()),
    ];
    `
    )
  })

  it('should adjust webpack config for importMeta in module exports', async () => {
    const filePath = 'src/webpack.config.js'
    tree.write(
      filePath,
      `
    module.exports = {
        ...config,
        plugins,
        output: { uniqueName: 'onecx-app-ui', publicPath: 'auto' },
    }`
    )
    await replaceTranslationPathFactories(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    module.exports = {
        ...config,
        plugins,
        output: { uniqueName: 'onecx-app-ui', publicPath: 'auto' },
        module: { parser: { javascript: { importMeta: false } } },
    }
    `
    )
  })


})