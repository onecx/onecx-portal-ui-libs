import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StandaloneSlotService } from './services/standalone-slot.service'
import { SLOT_SERVICE } from '@onecx/angular-remote-components'

@NgModule({
  imports: [CommonModule],
  providers: [
    StandaloneSlotService,
    {
      provide: SLOT_SERVICE,
      useExisting: StandaloneSlotService
    }
  ]
})
export class AngularStandaloneShellModule {}
