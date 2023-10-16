import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { MfeInfo } from '../model/mfe-info.model'
import { PageInfo } from '../model/page-info.model'

@Injectable({ providedIn: 'root' })
export class AppStateService {
  globalError$ = new BehaviorSubject<string | undefined>(undefined)
  globalLoading$ = new BehaviorSubject<boolean>(false)
  currentMfe$ = new BehaviorSubject<MfeInfo | undefined>(undefined)
  currentPage$ = new BehaviorSubject<PageInfo | undefined>(undefined)
}
