import { RemoteComponentConfig } from '@onecx/angular-utils'

export interface ocxRemoteComponent {
  ocxInitRemoteComponent(config: RemoteComponentConfig): void
}
