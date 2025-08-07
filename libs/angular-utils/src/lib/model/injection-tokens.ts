import { InjectionToken } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { RemoteComponentConfig } from './remote-component-config.model'

export const REMOTE_COMPONENT_CONFIG = new InjectionToken<ReplaySubject<RemoteComponentConfig>>(
  'REMOTE_COMPONENT_CONFIG'
)
