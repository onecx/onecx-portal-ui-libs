import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule, importProvidersFrom } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core'
import { PrimeNgModule } from './primeng.module'
import { ColumnGroupSelectionComponent } from './components/column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from './components/custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponent } from './components/data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponent } from './components/data-list-grid-sorting/data-list-grid-sorting.component'
import { DataListGridComponent } from './components/data-list-grid/data-list-grid.component'
import { DataTableComponent } from './components/data-table/data-table.component'
import { DataViewComponent } from './components/data-view/data-view.component'
import { InteractiveDataViewComponent } from './components/interactive-data-view/interactive-data-view.component'
import { SearchConfigComponent } from './components/search-config/search-config.component'
import { PageHeaderComponent } from './components/page-header/page-header.component'
import { SearchHeaderComponent } from './components/search-header/search-header.component'
import { GroupByCountDiagramComponent } from './components/group-by-count-diagram/group-by-count-diagram.component'
import { DiagramComponent } from './components/diagram/diagram.component'
import { DynamicPipe } from './pipes/dynamic.pipe'

import { IfPermissionDirective } from './directives/if-permission.directive'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { HttpClient } from '@angular/common/http'
import { createTranslateLoader } from '@onecx/angular-integration-interface'
import { TranslationCacheService } from '@onecx/angular-integration-interface'
import {
  IL10nsStrings,
  TimeagoClock,
  TimeagoCustomFormatter,
  TimeagoDefaultClock,
  TimeagoDefaultFormatter,
  TimeagoFormatter,
  TimeagoIntl,
  TimeagoModule,
} from 'ngx-timeago'
import { OcxTimeAgoPipe } from './pipes/ocxtimeago.pipe'
import { strings as englishStrings } from 'ngx-timeago/language-strings/en'

export class AngularAcceleratorMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.log(`Missing translation for ${params.key}`, params)
    return params.key
  }
}

export class OcxTimeagoIntl extends TimeagoIntl {
  override strings: IL10nsStrings = englishStrings
}

@NgModule({
  imports: [
    CommonModule,
    PrimeNgModule,
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
    OcxTimeAgoPipe,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: (UserService: UserService) => {
        return UserService.lang$.getValue()
      },
      deps: [UserService],
    },
    {
      provide: TimeagoIntl,
      useClass: OcxTimeagoIntl,
    },
    importProvidersFrom(TimeagoModule),
    {
      provide: TimeagoFormatter,
      useFactory: (TimeagoIntl: TimeagoIntl) => {
        return new TimeagoCustomFormatter(TimeagoIntl)
      },
      deps: [TimeagoIntl],
    },
    {
      provide: TimeagoClock,
      useClass: TimeagoDefaultClock,
    },
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
    OcxTimeAgoPipe,
    // DataListGridSortingComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AngularAcceleratorModule {}
