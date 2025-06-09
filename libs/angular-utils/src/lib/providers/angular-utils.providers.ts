import { Provider } from '@angular/core'
import { providePermissionService } from './permission-service.providers'
import { provideTranslationPathsForMfe, provideTranslationPathsForRemoteComponent } from './translation-path.providers'

export type ContentType = 'microfrontend' | 'remoteComponent'

export interface AngularUtilsProviderOptions {
  contentType?: ContentType
}

export function provideAngularUtils(options?: AngularUtilsProviderOptions): Provider[] {
  const providers = [...providePermissionService()]
  providers.push(prepareTranslationPathProviders(options?.contentType))
  return providers
}

function prepareTranslationPathProviders(contentType?: ContentType) {
  if (!contentType) return provideTranslationPathsForMfe()

  switch (contentType) {
    case 'microfrontend':
      return provideTranslationPathsForMfe()
    case 'remoteComponent':
      return provideTranslationPathsForRemoteComponent()
  }
}
