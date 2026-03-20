import { RemoteComponentConfig } from './remoteComponentConfig'

export interface ocxRemoteComponent {
  ocxInitRemoteComponent(config: RemoteComponentConfig): void
}
