import { CommonModule, registerLocaleData } from '@angular/common'
import de from '@angular/common/locales/de'
import { APP_INITIALIZER, Inject, LOCALE_ID, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateModule } from '@ngx-translate/core'
import { AngularAcceleratorModule } from '@onecx/angular-accelerator'
import {
  APPLICATION_NAME,
  AppStateService,
  ConfigurationService,
  SANITY_CHECK,
  ThemeService,
  UserService,
} from '@onecx/angular-integration-interface'
import { MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { PortalApiService } from '../services/portal-api.service'
import { UserProfileAPIService } from '../services/userprofile-api.service'
import { AnnouncementBannerComponent } from './components/announcement-banner/announcement-banner.component'
import { ButtonDialogComponent } from './components/button-dialog/button-dialog.component'
import { DialogMessageContentComponent } from './components/button-dialog/dialog-message-content/dialog-message-content.component'
import { OcxContentContainerComponent } from './components/content-container/content-container.component'
import { OcxContentComponent } from './components/content/content.component'
import { ColumnTogglerComponent } from './components/data-view-controls/column-toggler-component/column-toggler.component'
import { DataViewControlsComponent } from './components/data-view-controls/data-view-controls.component'
import { ViewTemplatePickerComponent } from './components/data-view-controls/view-template-picker/view-template-picker.component'
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component'
import { GlobalErrorComponent } from './components/error-component/global-error.component'
import { HelpItemEditorComponent } from './components/help-item-editor/help-item-editor.component'
import { AppInlineProfileComponent } from './components/inline-profile/inline-profile.component'
import { LifecycleComponent } from './components/lifecycle/lifecycle.component'
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component'
import { LoadingComponent } from './components/loading/loading.component'
import { MfeDebugComponent } from './components/mfe-debug/mfe-debug.component'
import { NoHelpItemComponent } from './components/no-help-item/no-help-item.component'
import { PageContentComponent } from './components/page-content/page-content.component'
import { PagingInfoComponent } from './components/paging-info/paging-info.component'
import { PortalFooterComponent } from './components/portal-footer/portal-footer.component'
import { HeaderComponent } from './components/portal-header/header.component'
import { PortalMenuHorizontalComponent } from './components/portal-menu-horizontal/portal-menu-horizontal.component'
import { PortalMenuComponent } from './components/portal-menu/portal-menu.component'
import { SubMenuComponent } from './components/portal-menu/submenu.component'
import { PortalPageComponent } from './components/portal-page/portal-page.component'
import { PortalViewportComponent } from './components/portal-viewport/portal-viewport.component'
import { CriteriaTemplateComponent } from './components/search-criteria/criteria-template/criteria-template.component'
import { SearchCriteriaComponent } from './components/search-criteria/search-criteria.component'
import { SupportTicketComponent } from './components/support-ticket/support-ticket.component'
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component'
import { AutofocusDirective } from './directives/autofocus.directive'
import { BasicDirective } from './directives/basic.directive'
import { OcxContentContainerDirective } from './directives/content-container.directive'
import { OcxContentDirective } from './directives/content.directive'
import { LoadingIndicatorDirective } from './directives/loading-indicator.directive'
import { PatchFormGroupValuesDirective } from './directives/patch-form-group-values.driective'
import { SetInputValueDirective } from './directives/set-input-value.directive'
import { standaloneInitializer } from './initializer/standalone.initializer'
import { PrimeNgModule } from './primeng.module'
import { DialogFooterComponent } from './components/dialog/dialog-footer/dialog-footer.component'
import { DialogContentComponent } from './components/dialog/dialog-content/dialog-content.component'
import { DialogInlineComponent } from './components/dialog/dialog-inline/dialog-inline.component'
import { TRANSLATION_PATH } from '@onecx/angular-utils'

export class PortalMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.log(`Missing translation for ${params.key}`, params)
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
    AngularAcceleratorModule,
    TranslateModule,
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
    GlobalErrorComponent,
    HeaderComponent,
    HelpItemEditorComponent,
    LoadingComponent,
    MfeDebugComponent,
    NoHelpItemComponent,
    PageContentComponent,
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
    LoadingIndicatorComponent,
    LoadingIndicatorDirective,
    BasicDirective,
    PatchFormGroupValuesDirective,
    SetInputValueDirective,
    ButtonDialogComponent,
    DialogFooterComponent,
    DialogContentComponent,
    DialogInlineComponent,
    DialogMessageContentComponent,
    OcxContentDirective,
    OcxContentContainerDirective,
    OcxContentComponent,
    OcxContentContainerComponent,
    LifecycleComponent,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: (userService: UserService) => {
        return userService.lang$.getValue()
      },
      deps: [UserService],
    },
    {
      provide: TRANSLATION_PATH,
      useValue: './onecx-portal-lib/assets/i18n/',
      multi: true
    },
    {
      provide: TRANSLATION_PATH,
      useValue: './onecx-portal-lib/assets/i18n/primeng/',
      multi: true
    },
    {
      provide: MessageService,
      useClass: MessageService,
    },
  ],
  exports: [
    AngularAcceleratorModule,
    AnnouncementBannerComponent,
    AppInlineProfileComponent,
    AutofocusDirective,
    ColumnTogglerComponent,
    CriteriaTemplateComponent,
    DataViewControlsComponent,
    DeleteDialogComponent,
    GlobalErrorComponent,
    HeaderComponent,
    HelpItemEditorComponent,
    LoadingComponent,
    MfeDebugComponent,
    NoHelpItemComponent,
    PageContentComponent,
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
    LoadingIndicatorComponent,
    LoadingIndicatorDirective,
    BasicDirective,
    PatchFormGroupValuesDirective,
    SetInputValueDirective,
    ButtonDialogComponent,
    DialogFooterComponent,
    DialogContentComponent,
    DialogInlineComponent,
    DialogMessageContentComponent,
    OcxContentDirective,
    OcxContentContainerDirective,
    OcxContentComponent,
    OcxContentContainerComponent,
    LifecycleComponent,
  ],
})
export class PortalCoreModule {
  public static forMicroFrontend(): ModuleWithProviders<PortalCoreModule> {
    return {
      ngModule: PortalCoreModule,
      providers: [{ provide: SANITY_CHECK, useValue: 'mfe' }],
    }
  }

  public static forRoot(appName: string, disableInitializer = false): ModuleWithProviders<PortalCoreModule> {
    const module: ModuleWithProviders<PortalCoreModule> = {
      ngModule: PortalCoreModule,
      providers: [
        { provide: SANITY_CHECK, useValue: 'root' },
        { provide: APPLICATION_NAME, useValue: appName },
      ],
    }
    if (!disableInitializer) {
      module.providers &&
        module.providers.push({
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: standaloneInitializer,
          deps: [
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerLocaleData((de as any).default ?? de)
    //  Do not change the line above until the following ts-jest bug is fixed: https://github.com/kulshekhar/ts-jest/issues/3925
    //  The ts-jest bug causes that the locale is not imported correctly.
  }
}
