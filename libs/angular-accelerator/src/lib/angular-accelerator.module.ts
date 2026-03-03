import { CommonModule } from '@angular/common'
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

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
import { SearchHeaderComponent } from './components/search-header/search-header.component'
import { AdvancedDirective } from './directives/advanced.directive'
import { IfBreakpointDirective } from './directives/if-breakpoint.directive'
import { IfPermissionDirective } from './directives/if-permission.directive'
import {
  providePermissionChecker,
  provideTranslationConnectionService,
  provideTranslationPathFromMeta,
  MultiLanguageMissingTranslationHandler,
  provideMultiLanguageIdentifier,
} from '@onecx/angular-utils'
import { SrcDirective } from './directives/src.directive'
import { OcxTooltipDirective } from './directives/ocx-tooltip.directive'
import { TooltipOnOverflowDirective } from './directives/tooltipOnOverflow.directive'
import { DynamicPipe } from './pipes/dynamic.pipe'
import { OcxTimeAgoPipe } from './pipes/ocxtimeago.pipe'
import { DynamicLocaleId } from './utils/dynamic-locale-id'
import { FilterViewComponent } from './components/filter-view/filter-view.component'
import { TemplateDirective } from './directives/template.directive'
import { OcxContentComponent } from './components/content/content.component'
import { OcxContentContainerComponent } from './components/content-container/content-container.component'
import { OcxContentDirective } from './directives/content.directive'
import { OcxContentContainerDirective } from './directives/content-container.directive'
import { LifecycleComponent } from './components/lifecycle/lifecycle.component'
import { DialogMessageContentComponent } from './components/dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from './components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from './components/dialog/dialog-footer/dialog-footer.component'
import { DialogInlineComponent } from './components/dialog/dialog-inline/dialog-inline.component'
import { GlobalErrorComponent } from './components/error-component/global-error.component'
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component'
import { BasicDirective } from './directives/basic.directive'
import { LoadingIndicatorDirective } from './directives/loading-indicator.directive'
import { MessageService } from 'primeng/api'
import { ConsentComponent } from './components/consent/consent.component'
import { LIB_VERSION } from '../version'

export class AngularAcceleratorMissingTranslationHandler extends MultiLanguageMissingTranslationHandler {}

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
    LifecycleComponent,
    PageHeaderComponent,
    DynamicPipe,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    OcxContentComponent,
    OcxContentContainerComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTooltipDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
    FilterViewComponent,
    TemplateDirective,
    OcxContentDirective,
    OcxContentContainerDirective,
    GlobalErrorComponent,
    LoadingIndicatorComponent,
    LoadingIndicatorDirective,
    BasicDirective,
    DialogFooterComponent,
    DialogContentComponent,
    DialogInlineComponent,
    DialogMessageContentComponent,
    ConsentComponent,
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
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-accelerator/assets/i18n/'),
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-accelerator/assets/i18n/primeng/'),
    provideMultiLanguageIdentifier('@onecx/angular-accelerator', LIB_VERSION, 'lib'),
    {
      provide: MessageService,
      useClass: MessageService,
    },
    AppConfigService,
    provideTranslationConnectionService(),
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
    LifecycleComponent,
    PageHeaderComponent,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    OcxContentComponent,
    OcxContentContainerComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTooltipDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
    FilterViewComponent,
    TemplateDirective,
    OcxContentDirective,
    OcxContentContainerDirective,
    GlobalErrorComponent,
    LoadingIndicatorComponent,
    LoadingIndicatorDirective,
    BasicDirective,
    DialogFooterComponent,
    DialogContentComponent,
    DialogInlineComponent,
    DialogMessageContentComponent,
    ConsentComponent,
  ],
})
export class AngularAcceleratorModule {}
