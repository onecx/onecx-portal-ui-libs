import { importProvidersFrom } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute } from '@angular/router'
import { UserService } from '@onecx/angular-integration-interface'
import { MockUserService } from '@onecx/angular-integration-interface/mocks'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { ButtonModule } from 'primeng/button'
import { DataViewModule } from 'primeng/dataview'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { MultiSelectModule } from 'primeng/multiselect'
import { PickListModule } from 'primeng/picklist'
import { ProgressBarModule } from 'primeng/progressbar'
import { SelectButtonModule } from 'primeng/selectbutton'
import { FloatLabelModule } from 'primeng/floatlabel'
import { TableModule } from 'primeng/table'
import { ChipModule } from 'primeng/chip'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { IfBreakpointDirective } from '../../directives/if-breakpoint.directive'
import { MockAuthModule } from '../../mock-auth/mock-auth.module'
import { ColumnType } from '../../model/column-type.model'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponent } from '../data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponent } from '../data-list-grid-sorting/data-list-grid-sorting.component'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataTableComponent } from '../data-table/data-table.component'
import { DataViewComponent } from '../data-view/data-view.component'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { SlotService } from '@onecx/angular-remote-components'
import { of } from 'rxjs'
import { Filter, FilterType } from '../../model/filter.model'
import { FilterViewComponent } from '../filter-view/filter-view.component'
import { FocusTrapModule } from 'primeng/focustrap'

type InteractiveDataViewInputTypes = Pick<
  InteractiveDataViewComponent,
  'data' | 'columns' | 'emptyResultsMessage' | 'disableFilterView' | 'filterViewDisplayMode'
>
const InteractiveDataViewComponentSBConfig: Meta<InteractiveDataViewComponent> = {
  title: 'InteractiveDataViewComponent',
  component: InteractiveDataViewComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        { provide: UserService, useClass: MockUserService },
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
      ],
    }),
  ],
  argTypes: {
    selectDisplayedChips: { type: 'function', control: false },
  },
}
const Template: StoryFn = (args) => ({
  props: args,
})

const defaultComponentArgs: InteractiveDataViewInputTypes = {
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
  disableFilterView: true,
  filterViewDisplayMode: 'button',
}

export const WithMockData = {
  argTypes: {
    componentStateChanged: { action: 'componentStateChanged' },
    selectionChanged: { action: 'selectionChanged' },
  },
  render: Template,
  args: {
    ...defaultComponentArgs,
    selectedRows: [],
  },
}

export const WithPageSizes = {
  argTypes: {
    componentStateChanged: { action: 'componentStateChanged' },
  },
  render: Template,
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
  },
}

const CustomContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
    <ng-template #listItem let-item>
      <div class="w-full px-4 py-2 card mb-4">
        <p>{{item.product}}</p>
        <p-progressBar [value]="item.amount" />
      </div>
    </ng-template>
    <ng-template #gridItem let-item>
      <div class="w-3 px-4 py-2 card m-0 mr-4">
        <p>{{item.product}}</p>
        <p-progressBar [value]="item.amount" />
      </div>
  </ng-template>
  <ng-template #topCenter>
    <input pInputText placeholder="Custom input injected via template" class="border-round w-18rem p-2" />
  </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomContentTemplates = {
  render: CustomContentInteractiveDataView,
  args: defaultComponentArgs,
}

const CustomTableCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableCellTemplates = {
  render: CustomTableCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomTableFilterCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE FILTER: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableFilterCellTemplates = {
  render: CustomTableFilterCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomTableColumnCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container> PRODUCT (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container> PRODUCT FILTER (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE FILTER: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateIdTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container> DATE (ID): {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateIdTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container> DATE FILTER (ID): {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableColumnTemplates = {
  render: CustomTableColumnCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

export const WithFilterViewChips = {
  render: CustomContentInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

export const WithFilterViewButton = {
  render: CustomContentInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewChipsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringFilterChipValue" let-rowObject="rowObject" let-column="column">
      <ng-container>CHIP: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomChipsTemplates = {
  render: CustomFilterViewChipsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewChipsByColumnInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringFilterChipValue" let-rowObject="rowObject" let-column="column">
      <ng-container>CHIP: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>PRODUCT (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>PRODUCT FILTER (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdFilterChip" let-rowObject="rowObject" let-column="column">
      <ng-container>PRODUCT CHIP (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomChipsByColumnTemplates = {
  render: CustomFilterViewChipsByColumnInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringFilterViewCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER VIEW: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomCellTemplates = {
  render: CustomFilterViewCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewCellsByColumnInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringFilterViewCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER VIEW: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>PRODUCT (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>PRODUCT FILTER (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdFilterViewCell" let-rowObject="rowObject" let-column="column">
      <ng-container>PRODUCT FILTER VIEW (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomCellByColumnTemplates = {
  render: CustomFilterViewCellsByColumnInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewNoFiltersInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="fitlerViewNoSelection">
      <span>Filter data to display chips</span>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomNoFiltersTemplate = {
  render: CustomFilterViewNoFiltersInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewChipContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data" filterViewChipStyleClass="pl-0 pr-3">
    <ng-template pTemplate="filterViewChipContent" let-filter="filter" let-column="column" let-filterValueTemplates="filterValueTemplates" let-truthyTemplate="truthyTemplate" let-filterValueTemplate="filterValueTemplate">
      <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">{{(column.nameKey | translate).at(0)}}</span>
      <span class="p-chip-text">
        <ng-container *ngIf="filter.filterType === 'TRUTHY'; else myChipValue">
          {{filter.value ? 'MY_YES' : 'MY_NO'}}
        </ng-container>
        <ng-template #myChipValue>
          <ng-container [ngTemplateOutlet]="filterValueTemplate"
          [ngTemplateOutletContext]="{
            templates: filterValueTemplates,
            filter: filter,
            column: column
          }">
          </ng-container>
        </ng-template>
      </span>
    </ng-template>
    <ng-template pTemplate="productIdFilterChip" let-rowObject="rowObject" let-column="column">
      <ng-container>
        [P]{{ rowObject[column.id] }}
      </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>D: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomChipContentTemplate = {
  render: CustomFilterViewChipContentInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewShowMoreChipInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="filterViewShowMoreChip" let-value>
    <span class="p-chip-text flex flex-nowrap align-items-center">
      <i class="pi pi-plus"></i> {{value}}
    </span>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomShowMoreChipTemplate = {
  render: CustomFilterViewShowMoreChipInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

export const WithFilterViewCustomChipSelection = {
  render: Template,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
    selectDisplayedChips: (filters: Filter[]) => {
      return filters.slice(0, 2).reverse()
    },
  },
}

export const WithFilterViewCustomStyles = {
  render: Template,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
    filterViewTableStyle: { 'max-height': '30vh' },
    filterViewPanelStyle: { 'max-width': '80%' },
  },
}

export default InteractiveDataViewComponentSBConfig
