import { Provider } from '@angular/core'
import { providePermissionService } from './permission-service.providers'
import { provideTranslationPathsForMfe, provideTranslationPathsForRemoteComponent } from './translation-path.providers'

export type ContentType = 'microfrontend' | 'remoteComponent'

export interface AngularUtilsProviderConfig {
  contentType: ContentType
}

export function provideAngularUtils(config: AngularUtilsProviderConfig): Provider[] {
  const providers = [...providePermissionService()]
  providers.push(prepareTranslationPathProviders(config.contentType))
  return providers
}

function prepareTranslationPathProviders(contentType: ContentType) {
  switch (contentType) {
    case 'microfrontend':
      return provideTranslationPathsForMfe()
    case 'remoteComponent':
      return provideTranslationPathsForRemoteComponent()
  }
}
