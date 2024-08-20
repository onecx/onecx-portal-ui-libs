import { CommonModule } from '@angular/common'
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateModule } from '@ngx-translate/core'

import { UserService } from '@onecx/angular-integration-interface'

import { AngularAcceleratorPrimeNgModule } from './angular-accelerator-primeng.module'
import { ColumnGroupSelectionComponent } from './components/column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from './components/custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponent } from './components/data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponent } from './components/data-list-grid-sorting/data-list-grid-sorting.component'
import { DataListGridComponent } from './components/data-list-grid/data-list-grid.component'
import { DataTableComponent } from './components/data-table/data-table.component'
import { DataViewComponent } from './components/data-view/data-view.component'
import { DiagramComponent } from './components/diagram/diagram.component'
import { GroupByCountDiagramComponent } from './components/group-by-count-diagram/group-by-count-diagram.component'
import { InteractiveDataViewComponent } from './components/interactive-data-view/interactive-data-view.component'
import { PageHeaderComponent } from './components/page-header/page-header.component'
import { SearchConfigComponent } from './components/search-config/search-config.component'
import { SearchHeaderComponent } from './components/search-header/search-header.component'
import { AdvancedDirective } from './directives/advanced.directive'
import { IfBreakpointDirective } from './directives/if-breakpoint.directive'
import { HAS_PERMISSION_CHECKER, IfPermissionDirective } from './directives/if-permission.directive'
import { SrcDirective } from './directives/src.directive'
import { DynamicPipe } from './pipes/dynamic.pipe'
import { OcxTimeAgoPipe } from './pipes/ocxtimeago.pipe'
import { AppConfigService } from './services/app-config-service'
import { DynamicLocaleId } from './utils/dynamic-locale-id'
import { firstValueFrom, skip } from 'rxjs'
import { TooltipOnOverflowDirective } from './directives/tooltipOnOverflow.directive'

export class AngularAcceleratorMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.log(`Missing translation for ${params.key}`, params)
    return params.key
  }
}

function appInitializer(userService: UserService) {
  return async () => {
    await firstValueFrom(userService.lang$.pipe(skip(1)))
  }
}

@NgModule({
  imports: [
    CommonModule,
    AngularAcceleratorPrimeNgModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    DataLayoutSelectionComponent,
    DataListGridSortingComponent,
    DataListGridComponent,
    DataTableComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    SearchConfigComponent,
    PageHeaderComponent,
    DynamicPipe,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [UserService],
    },
    {
      provide: HAS_PERMISSION_CHECKER,
      useExisting: UserService,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [UserService],
      multi: true,
    },
    AppConfigService,
  ],
  exports: [
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    DataLayoutSelectionComponent,
    DataListGridComponent,
    DataTableComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    SearchConfigComponent,
    PageHeaderComponent,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
  ],
})
export class AngularAcceleratorModule {}
