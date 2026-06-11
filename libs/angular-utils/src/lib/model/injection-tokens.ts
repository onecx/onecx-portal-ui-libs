import { InjectionToken } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { RemoteComponentConfig } from './remote-component-config.model'
import { RemoteComponentContext } from './remote-component-context.model'

export const REMOTE_COMPONENT_CONFIG = new InjectionToken<ReplaySubject<RemoteComponentConfig>>(
  'REMOTE_COMPONENT_CONFIG'
)

export const REMOTE_COMPONENT_CONTEXT = new InjectionToken<ReplaySubject<RemoteComponentContext>>(
  'REMOTE_COMPONENT_CONTEXT'
)

export const SKIP_STYLE_SCOPING = new InjectionToken<boolean>('SKIP_STYLE_SCOPING')
