import { CommonModule } from '@angular/common'
import {
  APP_INITIALIZER,
  LOCALE_ID,
  NgModule,
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateModule } from '@ngx-translate/core'

import { AppConfigService, UserService } from '@onecx/angular-integration-interface'
import { AngularRemoteComponentsModule } from '@onecx/angular-remote-components'

import { firstValueFrom, skip } from 'rxjs'
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
import { DataLoadingErrorComponent } from './components/data-loading-error/data-loading-error.component'
import { SearchHeaderComponent } from './components/search-header/search-header.component'
import { AdvancedDirective } from './directives/advanced.directive'
import { IfBreakpointDirective } from './directives/if-breakpoint.directive'
import { IfPermissionDirective } from './directives/if-permission.directive'
import { providePermissionChecker, TRANSLATION_PATH } from '@onecx/angular-utils'
import { SrcDirective } from './directives/src.directive'
import { TooltipOnOverflowDirective } from './directives/tooltipOnOverflow.directive'
import { DynamicPipe } from './pipes/dynamic.pipe'
import { OcxTimeAgoPipe } from './pipes/ocxtimeago.pipe'
import { DynamicLocaleId } from './utils/dynamic-locale-id'
import { FilterViewComponent } from './components/filter-view/filter-view.component'

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
    AngularRemoteComponentsModule,
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
    PageHeaderComponent,
    DynamicPipe,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    DataLoadingErrorComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
    FilterViewComponent,
  ],
  providers: [
    providePermissionChecker(),
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [UserService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [UserService],
      multi: true,
    },
    {
      provide: TRANSLATION_PATH,
      useValue: './onecx-angular-accelerator/assets/i18n/',
      multi: true
    },
    {
      provide: TRANSLATION_PATH,
      useValue: './onecx-angular-accelerator/assets/i18n/primeng/',
      multi: true
    },
    AppConfigService,
  ],
  exports: [
    AngularRemoteComponentsModule,
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    DataLayoutSelectionComponent,
    DataListGridComponent,
    DataTableComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    PageHeaderComponent,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    DataLoadingErrorComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
    FilterViewComponent,
  ],
})
export class AngularAcceleratorModule {}
