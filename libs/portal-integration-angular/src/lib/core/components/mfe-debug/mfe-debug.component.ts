import { Component, inject } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { Observable, map } from 'rxjs'
import { MfeInfo } from '../../../model/mfe-info.model'

@Component({
  standalone: false,
  selector: 'ocx-mfe-debug',
  templateUrl: './mfe-debug.component.html',
})
export class MfeDebugComponent {
  private appStateService = inject(AppStateService)

  isMFE$: Observable<boolean>
  mfeInfo$: Observable<MfeInfo>

  constructor() {
    this.isMFE$ = this.appStateService.currentMfe$.pipe(map((mfe) => !!mfe))
    this.mfeInfo$ = this.appStateService.currentMfe$.asObservable()
  }
}
