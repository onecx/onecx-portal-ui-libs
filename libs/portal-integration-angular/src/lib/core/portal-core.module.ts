import { CommonModule, registerLocaleData } from '@angular/common'
import de from '@angular/common/locales/de'
import { LOCALE_ID, ModuleWithProviders, NgModule, inject } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateModule } from '@ngx-translate/core'
import { AngularAcceleratorModule } from '@onecx/angular-accelerator'
import { APPLICATION_NAME, SANITY_CHECK, UserService } from '@onecx/angular-integration-interface'
import { TRANSLATION_PATH } from '@onecx/angular-utils'
import { MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { AnnouncementBannerComponent } from './components/announcement-banner/announcement-banner.component'
import { ButtonDialogComponent } from './components/button-dialog/button-dialog.component'
import { DialogMessageContentComponent } from './components/button-dialog/dialog-message-content/dialog-message-content.component'
import { ColumnTogglerComponent } from './components/data-view-controls/column-toggler-component/column-toggler.component'
import { DataViewControlsComponent } from './components/data-view-controls/data-view-controls.component'
import { ViewTemplatePickerComponent } from './components/data-view-controls/view-template-picker/view-template-picker.component'
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component'
import { DialogContentComponent } from './components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from './components/dialog/dialog-footer/dialog-footer.component'
import { DialogInlineComponent } from './components/dialog/dialog-inline/dialog-inline.component'
import { GlobalErrorComponent } from './components/error-component/global-error.component'
import { HelpItemEditorComponent } from './components/help-item-editor/help-item-editor.component'
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component'
import { LoadingComponent } from './components/loading/loading.component'
import { MfeDebugComponent } from './components/mfe-debug/mfe-debug.component'
import { NoHelpItemComponent } from './components/no-help-item/no-help-item.component'
import { PageContentComponent } from './components/page-content/page-content.component'
import { PagingInfoComponent } from './components/paging-info/paging-info.component'
import { PortalPageComponent } from './components/portal-page/portal-page.component'
import { CriteriaTemplateComponent } from './components/search-criteria/criteria-template/criteria-template.component'
import { SearchCriteriaComponent } from './components/search-criteria/search-criteria.component'
import { SupportTicketComponent } from './components/support-ticket/support-ticket.component'
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component'
import { AutofocusDirective } from './directives/autofocus.directive'
import { BasicDirective } from './directives/basic.directive'
import { LoadingIndicatorDirective } from './directives/loading-indicator.directive'
import { PatchFormGroupValuesDirective } from './directives/patch-form-group-values.driective'
import { SetInputValueDirective } from './directives/set-input-value.directive'
import { PrimeNgModule } from './primeng.module'

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
    AutofocusDirective,
    ColumnTogglerComponent,
    CriteriaTemplateComponent,
    DataViewControlsComponent,
    DeleteDialogComponent,
    GlobalErrorComponent,
    HelpItemEditorComponent,
    LoadingComponent,
    MfeDebugComponent,
    NoHelpItemComponent,
    PageContentComponent,
    PagingInfoComponent,
    PortalPageComponent,
    SearchCriteriaComponent,
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
      multi: true,
    },
    {
      provide: TRANSLATION_PATH,
      useValue: './onecx-portal-lib/assets/i18n/primeng/',
      multi: true,
    },
    {
      provide: MessageService,
      useClass: MessageService,
    },
  ],
  exports: [
    AngularAcceleratorModule,
    AnnouncementBannerComponent,
    AutofocusDirective,
    ColumnTogglerComponent,
    CriteriaTemplateComponent,
    DataViewControlsComponent,
    DeleteDialogComponent,
    GlobalErrorComponent,
    HelpItemEditorComponent,
    LoadingComponent,
    MfeDebugComponent,
    NoHelpItemComponent,
    PageContentComponent,
    PagingInfoComponent,
    PortalPageComponent,
    SearchCriteriaComponent,
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
  ],
})
export class PortalCoreModule {
  public static forMicroFrontend(): ModuleWithProviders<PortalCoreModule> {
    return {
      ngModule: PortalCoreModule,
      providers: [{ provide: SANITY_CHECK, useValue: 'mfe' }],
    }
  }

  public static forRoot(appName: string): ModuleWithProviders<PortalCoreModule> {
    const module: ModuleWithProviders<PortalCoreModule> = {
      ngModule: PortalCoreModule,
      providers: [
        { provide: SANITY_CHECK, useValue: 'root' },
        { provide: APPLICATION_NAME, useValue: appName },
      ],
    }
    return module
  }

  constructor() {
    const sanityCheck = inject(SANITY_CHECK, { optional: true })
    const parentSanityCheck = inject(SANITY_CHECK, { optional: true, skipSelf: true })

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
