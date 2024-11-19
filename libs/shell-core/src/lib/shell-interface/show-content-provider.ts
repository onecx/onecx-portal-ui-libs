import { InjectionToken } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export const SHOW_CONTENT_PROVIDER = new InjectionToken<ShowContentProvider>('SHOW_CONTENT_PROVIDER')

export interface ShowContentProvider {
  showContent$: BehaviorSubject<boolean>
}