import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlotComponent } from './components/slot/slot.component'

@NgModule({
  imports: [CommonModule],
  declarations: [SlotComponent],
  exports: [SlotComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShellCoreModule {}
