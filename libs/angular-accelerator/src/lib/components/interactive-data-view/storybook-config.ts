import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
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
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { MockAuthModule } from '../../mock-auth/mock-auth.module'
import { MenuModule } from 'primeng/menu'
import { PickListModule } from 'primeng/picklist'
import { SelectButtonModule } from 'primeng/selectbutton'
import { DialogModule } from 'primeng/dialog'
import { DataViewModule } from 'primeng/dataview'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { ProgressBarModule } from 'primeng/progressbar'
import { InputTextModule } from 'primeng/inputtext'
import { FloatLabelModule } from 'primeng/floatlabel'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { FocusTrapModule } from 'primeng/focustrap'
import { ChipModule } from 'primeng/chip'
import { ColumnType } from '../../model/column-type.model'
import { FilterType } from '../../model/filter.model'
import { TooltipOnOverflowDirective } from '../../directives/tooltipOnOverflow.directive'
import { SkeletonModule } from 'primeng/skeleton'

export const InteractiveDataViewComponentSBConfig: Meta<InteractiveDataViewComponent> = {
  title: 'Components/InteractiveDataViewComponent',
  component: InteractiveDataViewComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        provideUserServiceMock(),
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
      ],
      imports: [
        TableModule,
        ButtonModule,
        MultiSelectModule,
        StorybookTranslateModule,
        MockAuthModule,
        MenuModule,
        PickListModule,
        SelectButtonModule,
        DialogModule,
        DataViewModule,
        DropdownModule,
        FormsModule,
        ProgressBarModule,
        InputTextModule,
        FloatLabelModule,
        OverlayPanelModule,
        FocusTrapModule,
        ChipModule,
        SkeletonModule,
      ],
    }),
  ],
  argTypes: {
    selectDisplayedChips: { type: 'function', control: false },
  },
}
export const InteractiveDataViewTemplate: StoryFn = (args) => ({
  props: args,
})

export const defaultInteractiveDataViewArgs = {
  columns: [
    {
      id: 'product',
      columnType: ColumnType.STRING,
      nameKey: 'Product',
      sortable: false,
      filterable: true,
      predefinedGroupKeys: ['test'],
    },
    {
      id: 'amount',
      columnType: ColumnType.NUMBER,
      nameKey: 'Amount',
      sortable: true,
      predefinedGroupKeys: ['test', 'test1'],
    },
    {
      id: 'available',
      columnType: ColumnType.STRING,
      nameKey: 'Available',
      sortable: false,
      filterable: true,
      filterType: FilterType.TRUTHY,
      predefinedGroupKeys: ['test2'],
    },
    {
      id: 'date',
      columnType: ColumnType.DATE,
      nameKey: 'Date',
      sortable: false,
      filterable: true,
      predefinedGroupKeys: ['test2'],
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
}
