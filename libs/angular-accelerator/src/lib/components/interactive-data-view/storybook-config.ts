import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { importProvidersFrom, inject, provideAppInitializer } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { ActivatedRoute } from '@angular/router'
import { SlotService } from '@onecx/angular-remote-components'
import { of } from 'rxjs'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { IfBreakpointDirective } from '../../directives/if-breakpoint.directive'
import { CustomGroupColumnSelectorComponent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { DataViewComponent } from '../data-view/data-view.component'
import { DataTableComponent } from '../data-table/data-table.component'
import { DataLayoutSelectionComponent } from '../data-layout-selection/data-layout-selection.component'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataListGridSortingComponent } from '../data-list-grid-sorting/data-list-grid-sorting.component'
import { FilterViewComponent } from '../filter-view/filter-view.component'
import { TableModule } from '@openng/optimus-ui/table'
import { ButtonModule } from '@openng/optimus-ui/button'
import { MultiSelectModule } from '@openng/optimus-ui/multiselect'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { MenuModule } from '@openng/optimus-ui/menu'
import { PickListModule } from '@openng/optimus-ui/picklist'
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton'
import { DialogModule } from '@openng/optimus-ui/dialog'
import { DialogMessageContentComponent } from '../dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from '../dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../dialog/dialog-footer/dialog-footer.component'
import { DataViewModule } from '@openng/optimus-ui/dataview'
import { SelectModule } from '@openng/optimus-ui/select'
import { FormsModule } from '@angular/forms'
import { ProgressBarModule } from '@openng/optimus-ui/progressbar'
import { InputTextModule } from '@openng/optimus-ui/inputtext'
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel'
import { PopoverModule } from '@openng/optimus-ui/popover'
import { FocusTrapModule } from '@openng/optimus-ui/focustrap'
import { ChipModule } from '@openng/optimus-ui/chip'
import { ColumnType } from '../../model/column-type.model'
import { FilterType } from '../../model/filter.model'
import { TooltipOnOverflowDirective } from '../../directives/tooltipOnOverflow.directive'
import { SkeletonModule } from '@openng/optimus-ui/skeleton'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule, TooltipStyle } from '@openng/optimus-ui/tooltip'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { action } from 'storybook/actions'
import { UserService } from '@onecx/angular-integration-interface'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { providePortalDialogService } from '../../services/portal-dialog.service'

export const InteractiveDataViewComponentSBConfig: Meta<InteractiveDataViewComponent> = {
  title: 'Components/InteractiveDataViewComponent',
  component: InteractiveDataViewComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        // The Filter View's "Add Filter" dialog opens through the real
        // PortalDialogService. The provider (mirroring portal-dialog.service.spec.ts)
        // supplies DialogService + PortalDialogService; DynamicDialogConfig /
        // DynamicDialogRef are resolved from the service's own element injector, not
        // DI, so they no longer need to be declared here.
        providePortalDialogService(),
        // TranslateService must live in the environment (app) injector, not just the
        // NgModule injector (moduleMetadata): the Add Filter dialog is created dynamically
        // by the DialogService, whose injector chain is rooted at the env injector.
        // Without this the dynamically-created content/footer components fail with
        // NG0201 (no TranslateService) and the dialog renders empty.
        importProvidersFrom(StorybookTranslateModule),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: SlotService,
          useValue: {
            isSomeComponentDefinedForSlot() {
              return of(false)
            },
          },
        },
        provideUserServiceMock(),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserServiceMock },
        importProvidersFrom(StorybookThemeModule),
        TooltipStyle,
        provideAppInitializer(() => {
          const userServiceMock = inject(UserService) as unknown as UserServiceMock
          userServiceMock.permissionsTopic$.publish([
            'TEST_MGMT#TEST_DELETE',
            'TEST_MGMT#TEST_EDIT',
            'TEST_MGMT#TEST_VIEW',
          ])
        }),
      ],
    }),
    moduleMetadata({
      declarations: [
        InteractiveDataViewComponent,
        IfPermissionDirective,
        IfBreakpointDirective,
        CustomGroupColumnSelectorComponent,
        ColumnGroupSelectionComponent,
        DataViewComponent,
        DataTableComponent,
        DataLayoutSelectionComponent,
        DataListGridComponent,
        DataListGridSortingComponent,
        FilterViewComponent,
        TooltipOnOverflowDirective,
        // The PortalDialogService opens its dialogs through these non-standalone shell
        // components (content / footer / message), so they must be declared in a module
        // for the Filter View's "Add Filter" dialog to render in this Storybook.
        DialogMessageContentComponent,
        DialogContentComponent,
        DialogFooterComponent,
      ],
      imports: [
        TableModule,
        ButtonModule,
        MultiSelectModule,
        StorybookTranslateModule,
        MenuModule,
        PickListModule,
        SelectButtonModule,
        DialogModule,
        DataViewModule,
        SelectModule,
        FormsModule,
        ProgressBarModule,
        InputTextModule,
        FloatLabelModule,
        PopoverModule,
        FocusTrapModule,
        ChipModule,
        SkeletonModule,
        TooltipModule,
        OcxTooltipDirective,
      ],
    }),
  ],
  argTypes: {
    selectDisplayedChips: { type: 'function', control: false },
    draggableColumnGroupSelectorDialog: { control: { type: 'boolean' } },
    resizableColumnGroupSelectorDialog: { control: { type: 'boolean' } },
    restoreColumnGroupSelectorOrder: { control: { type: 'boolean' } },
  },
}

export const defaultInteractiveDataViewArgs = {
  columns: [
    // product / available / date are filterable, amount is not - the same single
    // source of truth for the Table column header filters and the "Add Filter"
    // dialog in the List / Grid views (see data-table-column.model.ts).
    {
      id: 'product',
      columnType: ColumnType.STRING,
      nameKey: 'Product',
      sortable: false,
      filterable: true,
      predefinedGroupKeys: ['test', 'all'],
    },
    {
      id: 'amount',
      columnType: ColumnType.NUMBER,
      nameKey: 'Amount',
      sortable: true,
      filterable: false,
      predefinedGroupKeys: ['test', 'test1', 'all'],
    },
    {
      id: 'available',
      columnType: ColumnType.STRING,
      nameKey: 'Available',
      sortable: false,
      filterable: true,
      filterType: FilterType.IS_NOT_EMPTY,
      predefinedGroupKeys: ['test2', 'all'],
    },
    {
      id: 'date',
      columnType: ColumnType.DATE,
      nameKey: 'Date',
      sortable: false,
      filterable: true,
      predefinedGroupKeys: ['test2', 'all'],
    },
  ],
  data: [
    {
      id: 1,
      product: 'Apples',
      amount: 2,
      available: false,
      imagePath:
        'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: new Date(2022, 1, 1, 13, 14, 55, 120),
    },
    {
      id: 2,
      product: 'Bananas',
      amount: 10,
      imagePath:
        'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: new Date(2022, 1, 1, 13, 14, 55, 120),
    },
    {
      id: 3,
      product: 'Strawberries',
      amount: 5,
      imagePath:
        'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: new Date(2022, 1, 3, 13, 14, 55, 120),
    },
  ],
  titleLineId: 'product',
  subtitleLineIds: ['amount'],
  emptyResultsMessage: 'No results',
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
  defaultGroupKey: 'test',
  draggableColumnGroupSelectorDialog: true,
  resizableColumnGroupSelectorDialog: true,
  restoreColumnGroupSelectorOrder: false,
}

export const defaultInteractiveDataViewActionsArgs = {
  deleteItem: {
    observed: () => true,
    emit: action('deleteItem'),
  },
  editItem: {
    observed: () => true,
    emit: action('editItem'),
  },
  viewItem: {
    observed: () => true,
    emit: action('viewItem'),
  },
}
