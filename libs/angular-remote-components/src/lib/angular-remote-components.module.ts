import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlotComponent } from './components/slot/slot.component'
import { SLOT_SERVICE, SlotService } from './services/slot.service'

@NgModule({
  imports: [CommonModule],
  declarations: [SlotComponent],
  exports: [SlotComponent],
  providers: [
    {
      provide: SLOT_SERVICE,
      useExisting: SlotService,
    },
  ],
})
export class AngularRemoteComponentsModule {}
