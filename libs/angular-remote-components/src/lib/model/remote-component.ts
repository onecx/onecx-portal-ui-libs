import { RemoteComponentConfig } from './remote-component-config-type'

export interface ocxRemoteComponent {
  ocxRemoteComponent(config: RemoteComponentConfig): void
}
