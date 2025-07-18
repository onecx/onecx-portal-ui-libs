import { Provider } from '@angular/core'
import { providePermissionService } from './permission-service.providers'
import { provideTranslationPaths } from './translation-path.providers'

export type ContentType = 'microfrontend' | 'remoteComponent'

export interface AngularUtilsProviderConfig {
  contentType: ContentType
}

export function provideAngularUtils(): Provider[] {
  const providers = [...providePermissionService()]
  providers.push(provideTranslationPaths())
  return providers
}