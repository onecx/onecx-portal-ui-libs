// import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
// import { Tree } from '@nx/devkit'
// import replaceTranslationPathFactories from './replace-translation-path-factories'

// describe('replace-translation-path-factories', () => {
//   let tree: Tree

//   beforeEach(() => {
//     tree = createTreeWithEmptyWorkspace()
//   })

//   it('should replace provider with TRANSLATION_PATH with provideTranslationPathFromMeta', async () => {
//     const filePath = 'src/app/main.ts'
//     tree.write(
//       filePath,
//       `
//     import { createTranslateLoader, provideThemeConfig, SKIP_STYLE_SCOPING, TRANSLATION_PATH } from '@onecx/angular-utils'
//     @NgModule()
//     providers: [
//         provideAuthService(),
//         {
//         provide: TRANSLATION_PATH,
//         useValue: './assets/i18n/',
//         multi: true
//         },`
//     )
//     await replaceTranslationPathFactories(tree)

//     const content = tree.read(filePath)?.toString()

//     expect(content).toEqualIgnoringWhitespace(`
//     import { createTranslateLoader, provideThemeConfig, SKIP_STYLE_SCOPING, provideTranslationPathFromMeta } from '@onecx/angular-utils'
//     @NgModule()
//     providers: [
//         provideAuthService(),
//         provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
//     `
//     )
//   })

//   it('should replace provider with remoteComponentTranslationPathFactory with provideTranslationPathFromMeta', async () => {
//     const filePath = 'src/app/main.ts'
//     tree.write(
//       filePath,
//       `
//     import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
//     import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-remote-components'
//     import { TRANSLATION_PATH, createTranslateLoader, remoteComponentTranslationPathFactory } from '@onecx/angular-utils'
//     @NgModule()
//     providers: [
//       provideHttpClient(withInterceptorsFromDi()),
//       {
//         provide: TRANSLATION_PATH,
//         useFactory: (remoteComponentConfig: ReplaySubject<RemoteComponentConfig>) =>
//           remoteComponentTranslationPathFactory('assets/i18n/')(remoteComponentConfig),
//         multi: true,
//         deps: [REMOTE_COMPONENT_CONFIG]
//       },`
//     )
//     await replaceTranslationPathFactories(tree)

//     const content = tree.read(filePath)?.toString()

//     expect(content).toEqualIgnoringWhitespace(`
//     import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
//     import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-remote-components'
//     import { createTranslateLoader } from '@onecx/angular-utils'
//     @NgModule()
//     providers: [
//       provideHttpClient(withInterceptorsFromDi()),
//       provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
//     `
//     )
//   })

//   it('should replace provider with translationPathFactory with provideTranslationPathFromMeta', async () => {
//     const filePath = 'src/app/main.ts'
//     tree.write(
//       filePath,
//       `
//     import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
//     import { AppStateService } from '@onecx/angular-integration-interface'
//     import { TRANSLATION_PATH, createTranslateLoader, translationPathFactory } from '@onecx/angular-utils'
//     @NgModule()
//     providers: [
//       provideHttpClient(withInterceptorsFromDi()),
//       {
//       provide: TRANSLATION_PATH,
//       useFactory: (appStateService: AppStateService) => translationPathFactory('assets/i18n/')(appStateService),
//       multi: true,
//       deps: [AppStateService]
//     },`
//     )
//     await replaceTranslationPathFactories(tree)

//     const content = tree.read(filePath)?.toString()

//     expect(content).toEqualIgnoringWhitespace(`
//     import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
//     import { AppStateService } from '@onecx/angular-integration-interface'
//     import { createTranslateLoader } from '@onecx/angular-utils'
//     @NgModule()
//     providers: [
//       provideHttpClient(withInterceptorsFromDi()),
//       provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
//     `
//     )
//   })
// })