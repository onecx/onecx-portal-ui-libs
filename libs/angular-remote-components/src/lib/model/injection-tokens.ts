import { InjectionToken } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { RemoteComponentConfig } from "./remote-component-config.model";

/**
 * @deprecated Please use baseURL included in REMOTE_COMPONENT_CONFIG instead
*/
export const BASE_URL = new InjectionToken<ReplaySubject<string>>('BASE_URL')

export const REMOTE_COMPONENT_CONFIG = new InjectionToken<ReplaySubject<RemoteComponentConfig>>('REMOTE_COMPONENT_CONFIG')
