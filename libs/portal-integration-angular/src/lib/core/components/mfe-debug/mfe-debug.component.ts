import { Component } from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { map, Observable } from 'rxjs'
import { MfeInfo } from '../../../model/mfe-info.model'
import { AppStateService } from '../../../services/app-state.service'

@Component({
  selector: 'ocx-mfe-debug',
  templateUrl: './mfe-debug.component.html',
})
@UntilDestroy()
export class MfeDebugComponent {
  isMFE$: Observable<boolean>
  mfeInfo$: Observable<MfeInfo>

  constructor(private appStateService: AppStateService) {
    this.isMFE$ = this.appStateService.currentMfe$.pipe(untilDestroyed(this), map((mfe) => mfe ? true : false))
    this.mfeInfo$ = this.appStateService.currentMfe$.asObservable()
  }
}
