import { NgModule } from '@angular/core'
import { MessageService } from 'primeng/api'
import { BadgeModule } from 'primeng/badge'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { MenuModule } from 'primeng/menu'
import { MenubarModule } from 'primeng/menubar'
import { MessageModule } from 'primeng/message'
import { MessagesModule } from 'primeng/messages'
import { RippleModule } from 'primeng/ripple'
import { SkeletonModule } from 'primeng/skeleton'
import { ToastModule } from 'primeng/toast'
import { TooltipModule } from 'primeng/tooltip'
import { SelectButtonModule } from 'primeng/selectbutton'
import { InputTextModule } from 'primeng/inputtext'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { PickListModule } from 'primeng/picklist'
import { MultiSelectModule } from 'primeng/multiselect'
import { TableModule } from 'primeng/table'
import { InputNumberModule } from 'primeng/inputnumber'
import { DialogModule } from 'primeng/dialog'
import { InputSwitchModule } from 'primeng/inputswitch'
import { DataViewModule } from 'primeng/dataview'
import { PortalMessageService } from '../services/message.service'
import { ChartModule } from 'primeng/chart'
import { DialogService } from 'primeng/dynamicdialog'

@NgModule({
  imports: [
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputSwitchModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    RippleModule,
    SkeletonModule,
    ToastModule,
    TooltipModule,
    SelectButtonModule,
    InputTextModule,
    InputNumberModule,
    ToggleButtonModule,
    PickListModule,
    MultiSelectModule,
    TableModule,
    DataViewModule,
    ChartModule,
    MessageModule,
  ],
  providers: [{ provide: MessageService, useExisting: PortalMessageService }, DialogService],
  exports: [
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputSwitchModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    RippleModule,
    SkeletonModule,
    ToastModule,
    TooltipModule,
    SelectButtonModule,
    InputTextModule,
    InputNumberModule,
    ToggleButtonModule,
    PickListModule,
    MultiSelectModule,
    TableModule,
    DataViewModule,
    ChartModule,
    MessageModule,
  ],
})
export class PrimeNgModule {}
