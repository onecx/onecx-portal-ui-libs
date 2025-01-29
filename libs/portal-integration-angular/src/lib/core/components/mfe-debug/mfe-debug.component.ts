import { Component } from '@angular/core'
import { map, Observable } from 'rxjs'
import { MfeInfo } from '../../../model/mfe-info.model'
import { AppStateService } from '@onecx/angular-integration-interface'

@Component({
  standalone: false,
  selector: 'ocx-mfe-debug',
  templateUrl: './mfe-debug.component.html',
})
export class MfeDebugComponent {
  isMFE$: Observable<boolean>
  mfeInfo$: Observable<MfeInfo>

  constructor(private appStateService: AppStateService) {
    this.isMFE$ = this.appStateService.currentMfe$.pipe(map((mfe) => !!mfe))
    this.mfeInfo$ = this.appStateService.currentMfe$.asObservable()
  }
}
