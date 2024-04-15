import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { LOCALE_ID, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core'

import { AppStateService, UserService } from '@onecx/angular-integration-interface'

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
import { IfPermissionDirective } from './directives/if-permission.directive'
import { SrcDirective } from './directives/src.directive'
import { DynamicPipe } from './pipes/dynamic.pipe'
import { OcxTimeAgoPipe } from './pipes/ocxtimeago.pipe'
import { AppConfigService } from './services/app-config-service'
import { TranslationCacheService } from './services/translation-cache.service'
import { createTranslateLoader } from './utils/create-translate-loader.utils'

export class AngularAcceleratorMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.log(`Missing translation for ${params.key}`, params)
    return params.key
  }
}

@NgModule({
  imports: [
    CommonModule,
    AngularAcceleratorPrimeNgModule,
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, AppStateService, TranslationCacheService],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: AngularAcceleratorMissingTranslationHandler,
      },
    }),
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
    SrcDirective,
    AdvancedDirective,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: (UserService: UserService) => {
        return UserService.lang$.getValue()
      },
      deps: [UserService],
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
    SrcDirective,
    AdvancedDirective,
    // DataListGridSortingComponent,
  ],
})
export class AngularAcceleratorModule {}
