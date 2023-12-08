import { CommonModule, registerLocaleData } from '@angular/common'
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  LOCALE_ID,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { APPLICATION_NAME, AUTH_SERVICE, MFE_INFO, MFE_INFO_FN, SANITY_CHECK } from '../api/injection-tokens'
import { MfeInfo } from '../model/mfe-info.model'
import { AutofocusDirective } from './directives/autofocus.directive'
import { IfBreakpointDirective } from './directives/if-breakpoint.directive'
import { IfPermissionDirective } from './directives/if-permission.directive'
import { AppInlineProfileComponent } from './components/inline-profile/inline-profile.component'
import { LoadingComponent } from './components/loading/loading.component'
import { MfeDebugComponent } from './components/mfe-debug/mfe-debug.component'
import { PageHeaderComponent } from './components/page-header/page-header.component'
import { PageContentComponent } from './components/page-content/page-content.component'
import { PagingInfoComponent } from './components/paging-info/paging-info.component'
import { PortalFooterComponent } from './components/portal-footer/portal-footer.component'
import { HeaderComponent } from './components/portal-header/header.component'
import { PortalMenuComponent } from './components/portal-menu/portal-menu.component'
import { PortalMenuHorizontalComponent } from './components/portal-menu-horizontal/portal-menu-horizontal.component'
import { SubMenuComponent } from './components/portal-menu/submenu.component'
import { PortalPageComponent } from './components/portal-page/portal-page.component'
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component'
import { PortalViewportComponent } from './components/portal-viewport/portal-viewport.component'
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component'
import { DynamicPipe } from './pipes/dynamic.pipe'
import { ConfigurationService } from '../services/configuration.service'
import { DataViewControlsComponent } from './components/data-view-controls/data-view-controls.component'
import { SearchCriteriaComponent } from './components/search-criteria/search-criteria.component'
import { ColumnTogglerComponent } from './components/data-view-controls/column-toggler-component/column-toggler.component'
import { standaloneInitializer } from './initializer/standalone.initializer'
import { PortalApiService } from '../services/portal-api.service'
import { CriteriaTemplateComponent } from './components/search-criteria/criteria-template/criteria-template.component'
import { ThemeService } from '../services/theme.service'
import { GlobalErrorComponent } from './components/error-component/global-error.component'
import { AppStateService } from '../services/app-state.service'
import { AnnouncementBannerComponent } from './components/announcement-banner/announcement-banner.component'
import { ViewTemplatePickerComponent } from './components/data-view-controls/view-template-picker/view-template-picker.component'
import { SupportTicketComponent } from './components/support-ticket/support-ticket.component'
import { HelpItemEditorComponent } from './components/help-item-editor/help-item-editor.component'
import { NoHelpItemComponent } from './components/no-help-item/no-help-item.component'
import { DataListGridComponent } from './components/data-list-grid/data-list-grid.component'
import { PrimeNgModule } from './primeng.module'
import { MockAuthService } from '../mock-auth/mock-auth.service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { TranslateCombinedLoader } from './utils/translate.combined.loader'
import { DataTableComponent } from './components/data-table/data-table.component'
import de from '@angular/common/locales/de'
import { DataViewComponent } from './components/data-view/data-view.component'
import { InteractiveDataViewComponent } from './components/interactive-data-view/interactive-data-view.component'
import { DataLayoutSelectionComponent } from './components/data-layout-selection/data-layout-selection.component'
import { ColumnGroupSelectionComponent } from './components/column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from './components/custom-group-column-selector/custom-group-column-selector.component'
import { SearchHeaderComponent } from './components/search-header/search-header.component'
import { AdvancedDirective } from './directives/advanced.directive'
import { BasicDirective } from './directives/basic.directive'
import { DataListGridSortingComponent } from './components/data-list-grid-sorting/data-list-grid-sorting.component'
import { RelativeDatePipe } from './pipes/relative-date.pipe'
import { MessageService } from 'primeng/api'
import { PatchFormGroupValuesDirective } from './directives/patch-form-group-values.driective'
import { SetInputValueDirective } from './directives/set-input-value.directive'
import { DiagramComponent } from './components/diagram/diagram.component'
import { GroupByCountDiagramComponent } from './components/group-by-count-diagram/group-by-count-diagram.component'
import { UserService } from '../services/user.service'
import { UserProfileAPIService } from '../services/userprofile-api.service'
import { AsyncTranslateLoader } from './utils/async-translate-loader.utils'
import { combineLatest, filter, map } from 'rxjs'

export function createTranslateLoader(http: HttpClient, appStateService: AppStateService): TranslateLoader {
  return new AsyncTranslateLoader(
    combineLatest([appStateService.currentMfe$.asObservable(), appStateService.globalLoading$.asObservable()]).pipe(
      filter(([, isLoading]) => !isLoading),
      map(([currentMfe]) => {
        if (currentMfe.remoteBaseUrl) {
          return new TranslateCombinedLoader(
            new TranslateHttpLoader(http, `${currentMfe.remoteBaseUrl}/assets/i18n/`, '.json'),
            new TranslateHttpLoader(http, `./assets/i18n/`, '.json'),
            new TranslateHttpLoader(http, `./onecx-portal-lib/assets/i18n/`, '.json')
          )
        } else {
          return new TranslateCombinedLoader(
            new TranslateHttpLoader(http, `./assets/i18n/`, '.json'),
            new TranslateHttpLoader(http, `./onecx-portal-lib/assets/i18n/`, '.json')
          )
        }
      })
    )
  )
}

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.log(`Missing translation for ${params.key}`)
    return params.key
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    TranslateModule.forRoot({
      isolate: true,
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient, AppStateService] },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
    }),
    ConfirmDialogModule,
  ],
  declarations: [
    AnnouncementBannerComponent,
    AppInlineProfileComponent,
    AutofocusDirective,
    ColumnTogglerComponent,
    CriteriaTemplateComponent,
    DataViewControlsComponent,
    DeleteDialogComponent,
    DynamicPipe,
    GlobalErrorComponent,
    HeaderComponent,
    HelpItemEditorComponent,
    IfBreakpointDirective,
    IfPermissionDirective,
    LoadingComponent,
    MfeDebugComponent,
    NoHelpItemComponent,
    PageContentComponent,
    PageHeaderComponent,
    PagingInfoComponent,
    PortalFooterComponent,
    PortalMenuComponent,
    PortalMenuHorizontalComponent,
    PortalPageComponent,
    PortalViewportComponent,
    SearchCriteriaComponent,
    SubMenuComponent,
    SupportTicketComponent,
    UserAvatarComponent,
    ViewTemplatePickerComponent,
    DataListGridComponent,
    DataTableComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    DataLayoutSelectionComponent,
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    SearchHeaderComponent,
    AdvancedDirective,
    BasicDirective,
    DataListGridSortingComponent,
    RelativeDatePipe,
    PatchFormGroupValuesDirective,
    SetInputValueDirective,
    DiagramComponent,
    GroupByCountDiagramComponent,
  ],
  providers: [
    ConfigurationService,
    MockAuthService,
    {
      provide: LOCALE_ID,
      useFactory: (translate: TranslateService) => {
        const browserLang = translate.getBrowserLang() || ''
        return browserLang.match(/en|de/) ? browserLang : 'en'
      },
      deps: [TranslateService],
    },
  ],
  exports: [
    AnnouncementBannerComponent,
    AppInlineProfileComponent,
    AutofocusDirective,
    ColumnTogglerComponent,
    CriteriaTemplateComponent,
    DataViewControlsComponent,
    DeleteDialogComponent,
    DynamicPipe,
    GlobalErrorComponent,
    HeaderComponent,
    HelpItemEditorComponent,
    IfBreakpointDirective,
    IfPermissionDirective,
    LoadingComponent,
    MfeDebugComponent,
    NoHelpItemComponent,
    PageContentComponent,
    PageHeaderComponent,
    PagingInfoComponent,
    PortalFooterComponent,
    PortalMenuComponent,
    PortalMenuHorizontalComponent,
    PortalPageComponent,
    PortalViewportComponent,
    SearchCriteriaComponent,
    SubMenuComponent,
    SupportTicketComponent,
    UserAvatarComponent,
    ViewTemplatePickerComponent,
    TranslateModule,
    PrimeNgModule,
    DataTableComponent,
    DataListGridComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    DataLayoutSelectionComponent,
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    SearchHeaderComponent,
    AdvancedDirective,
    BasicDirective,
    RelativeDatePipe,
    PatchFormGroupValuesDirective,
    SetInputValueDirective,
    DiagramComponent,
    GroupByCountDiagramComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ColumnTogglerComponent],
})
export class PortalCoreModule {
  public static forMicroFrontend(): ModuleWithProviders<PortalCoreModule> {
    return {
      ngModule: PortalCoreModule,
      providers: [
        { provide: SANITY_CHECK, useValue: 'mfe' },
        {
          provide: MFE_INFO,
          useFactory: (mfInfoFn: () => MfeInfo): MfeInfo => {
            console.log(`MFE_INFO Factory called now `)
            return mfInfoFn()
          },
          deps: [MFE_INFO_FN],
        },
      ],
    }
  }

  public static forRoot(appName: string, disableInitializer = false): ModuleWithProviders<PortalCoreModule> {
    const module: ModuleWithProviders<PortalCoreModule> = {
      ngModule: PortalCoreModule,
      providers: [
        { provide: SANITY_CHECK, useValue: 'root' },
        { provide: MFE_INFO_FN, useValue: () => undefined },
        { provide: APPLICATION_NAME, useValue: appName },
        {
          provide: MessageService,
          useClass: MessageService,
        },
      ],
    }
    if (!disableInitializer) {
      module.providers &&
        module.providers.push({
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: standaloneInitializer,
          deps: [
            AUTH_SERVICE,
            ConfigurationService,
            PortalApiService,
            ThemeService,
            APPLICATION_NAME,
            AppStateService,
            UserService,
            UserProfileAPIService,
          ],
        })
    }
    return module
  }

  constructor(
    @Optional() @Inject(SANITY_CHECK) sanityCheck?: string,
    @Optional() @SkipSelf() @Inject(SANITY_CHECK) parentSanityCheck?: string
  ) {
    console.log(`*** Portal Core module constructor, mode:  ${sanityCheck}`)
    if (sanityCheck === undefined) {
      throw new Error(`Always import PortalCoreModule using either 'forRoot()' or 'forMicroFrontend()' helper methods.`)
    }
    if (parentSanityCheck === sanityCheck && sanityCheck === 'root') {
      throw new Error(
        `PortalCoreModule with scope '${sanityCheck}' is already loaded.
         Make sure you only use 'PortalCoreModule.forRoot()' in you root AppModule and that you use 'PortalCoreModule.forMicrofrontend()' in your feature modules`
      )
    }
    registerLocaleData(de)
  }
}
