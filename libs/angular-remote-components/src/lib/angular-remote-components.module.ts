import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlotComponent } from './components/slot/slot.component'
import { AppConfigService } from '@onecx/angular-integration-interface'

@NgModule({
  imports: [CommonModule],
  declarations: [SlotComponent],
  exports: [SlotComponent],
  providers: [AppConfigService],
})
export class AngularRemoteComponentsModule {}
