import { InjectionToken } from '@angular/core'
import { ReplaySubject } from 'rxjs'

/**
 * @deprecated Please use baseURL included in REMOTE_COMPONENT_CONFIG instead
 */
export const BASE_URL = new InjectionToken<ReplaySubject<string>>('BASE_URL')
