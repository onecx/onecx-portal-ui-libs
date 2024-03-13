import { RemoteComponentConfig } from './remote-component-config.model'

export interface ocxRemoteComponent {
  ocxRemoteComponent(config: RemoteComponentConfig): void
}
