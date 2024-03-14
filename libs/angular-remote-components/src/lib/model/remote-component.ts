import { RemoteComponentConfig } from './remote-component-config.model'

export interface ocxInitRemoteComponent {
  ocxRemoteComponent(config: RemoteComponentConfig): void
}
