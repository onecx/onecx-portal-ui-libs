import { RemoteComponentConfig } from '@onecx/angular-integration-interface'

export interface ocxRemoteComponent {
  ocxInitRemoteComponent(config: RemoteComponentConfig): void
}
