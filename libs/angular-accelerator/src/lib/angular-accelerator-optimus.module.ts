import { NgModule } from '@angular/core'
import { SelectModule } from '@openng/optimus-ui/select'
import { ButtonModule } from '@openng/optimus-ui/button'
import { DialogModule } from '@openng/optimus-ui/dialog'
import { PickListModule } from '@openng/optimus-ui/picklist'
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton'
import { DataViewModule } from '@openng/optimus-ui/dataview'
import { TableModule } from '@openng/optimus-ui/table'
import { MenuModule } from '@openng/optimus-ui/menu'
import { ChartModule } from '@openng/optimus-ui/chart'
import { MultiSelectModule } from '@openng/optimus-ui/multiselect'
import { BreadcrumbModule } from '@openng/optimus-ui/breadcrumb'
import { SkeletonModule } from '@openng/optimus-ui/skeleton'
import { MessageModule } from '@openng/optimus-ui/message'
import { SharedModule } from '@openng/optimus-ui/api'
import { CheckboxModule } from '@openng/optimus-ui/checkbox'
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel'
import { ChipModule } from '@openng/optimus-ui/chip'
import { PopoverModule } from '@openng/optimus-ui/popover'
import { FocusTrapModule } from '@openng/optimus-ui/focustrap'
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { RippleModule } from '@openng/optimus-ui/ripple'
import { provideOptimus } from '@openng/optimus-ui/config'
import { TimelineModule } from '@openng/optimus-ui/timeline'

@NgModule({
  imports: [
    BreadcrumbModule,
    ChipModule,
    CheckboxModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    PickListModule,
    SelectButtonModule,
    DataViewModule,
    TableModule,
    MenuModule,
    ChartModule,
    MultiSelectModule,
    SkeletonModule,
    MessageModule,
    FloatLabelModule,
    PopoverModule,
    FocusTrapModule,
    TooltipModule,
    TimelineModule,
    RippleModule,
    SharedModule,
  ],
  exports: [
    BreadcrumbModule,
    ChipModule,
    CheckboxModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    PickListModule,
    SelectButtonModule,
    DataViewModule,
    TableModule,
    MenuModule,
    ChartModule,
    MultiSelectModule,
    SkeletonModule,
    MessageModule,
    FloatLabelModule,
    PopoverModule,
    FocusTrapModule,
    TooltipModule,
    TimelineModule,
    RippleModule,
    SharedModule,
  ],
  providers: [provideOptimus()],
})
export class AngularAcceleratorOptimusModule {}
