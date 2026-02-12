import { NgModule } from '@angular/core'
import { SelectModule } from 'primeng/select'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { PickListModule } from 'primeng/picklist'
import { SelectButtonModule } from 'primeng/selectbutton'
import { DataViewModule } from 'primeng/dataview'
import { TableModule } from 'primeng/table'
import { MenuModule } from 'primeng/menu'
import { ChartModule } from 'primeng/chart'
import { MultiSelectModule } from 'primeng/multiselect'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { SkeletonModule } from 'primeng/skeleton'
import { MessageModule } from 'primeng/message'
import { SharedModule } from 'primeng/api'
import { CheckboxModule } from 'primeng/checkbox'
import { FloatLabelModule } from 'primeng/floatlabel'
import { ChipModule } from 'primeng/chip'
import { PopoverModule } from 'primeng/popover'
import { FocusTrapModule } from 'primeng/focustrap'
import { TooltipModule } from 'primeng/tooltip'
import { RippleModule } from 'primeng/ripple'
import { providePrimeNG } from 'primeng/config'
import { TimelineModule } from 'primeng/timeline'

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
    SelectButtonModule,
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
    SelectButtonModule,
    SharedModule,
  ],
  providers: [providePrimeNG()],
})
export class AngularAcceleratorPrimeNgModule {}
