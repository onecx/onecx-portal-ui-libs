import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { importProvidersFrom, inject, provideAppInitializer } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
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
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { TooltipStyle } from '@openng/optimus-ui/tooltip'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { action } from 'storybook/actions'
import { UserService } from '@onecx/angular-integration-interface'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'

export const InteractiveDataViewComponentSBConfig: Meta<InteractiveDataViewComponent> = {
  title: 'Components/InteractiveDataViewComponent',
  component: InteractiveDataViewComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
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
        TooltipOnOverflowDirective
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
        OcxTooltipDirective
      ],
    }),
  ],
  argTypes: {
    selectDisplayedChips: { type: 'function', control: false },
  },
}

export const defaultInteractiveDataViewArgs = {
  columns: [
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
      imagePath: '',
      date: new Date(2022, 1, 1, 13, 14, 55, 120),
    },
    {
      id: 2,
      product: 'Bananas',
      amount: 10,
      imagePath: '',
      date: new Date(2022, 1, 1, 13, 14, 55, 120),
    },
    {
      id: 3,
      product: 'Strawberries',
      amount: 5,
      imagePath: '',
      date: new Date(2022, 1, 3, 13, 14, 55, 120),
    },
  ],
  emptyResultsMessage: 'No results',
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
  defaultGroupKey: 'test',
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
