import { Component } from '@angular/core'
import { MfeInfo } from '../../../model/mfe-info.model'
import { ConfigurationService } from '../../../services/configuration.service'

@Component({
  selector: 'ocx-mfe-debug',
  templateUrl: './mfe-debug.component.html',
})
export class MfeDebugComponent {
  isMFE: boolean
  mfeInfo: MfeInfo | undefined

  constructor(private config: ConfigurationService) {
    this.isMFE = this.config.areWeRunningAsMFE()
    this.mfeInfo = this.config.getMFEInfo()
  }
}
