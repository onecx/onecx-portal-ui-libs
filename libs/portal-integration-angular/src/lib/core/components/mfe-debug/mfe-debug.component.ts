import { Component } from '@angular/core'
import { MfeInfo } from '../../../model/mfe-info.model'
import { AppStateService } from '../../../services/app-state.service'

@Component({
  selector: 'ocx-mfe-debug',
  templateUrl: './mfe-debug.component.html',
})
export class MfeDebugComponent {
  isMFE: boolean | undefined
  mfeInfo: MfeInfo | undefined

  constructor(private appStateService: AppStateService) {
    // this.isMFE = this.config.areWeRunningAsMFE()
    this.appStateService.currentMfe$.subscribe((mfe) => mfe ? this.isMFE = true : this.isMFE = false)
    // this.mfeInfo = this.config.getMFEInfo()
    this.appStateService.currentMfe$.subscribe((mfe) => this.mfeInfo = mfe)
  }
}
