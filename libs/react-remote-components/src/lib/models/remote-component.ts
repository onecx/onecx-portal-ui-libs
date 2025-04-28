import { RemoteComponentConfig } from './remote-component-config.model'

export interface ocxRemoteComponent {
  ocxInitRemoteComponent(config: RemoteComponentConfig): void
}
