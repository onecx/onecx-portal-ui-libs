import { argsToTemplate, Meta, StoryFn } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { Filter } from '../../model/filter.model'
import {
  defaultInteractiveDataViewActionsArgs,
  defaultInteractiveDataViewArgs,
  InteractiveDataViewComponentSBConfig,
} from './storybook-config'

const InteractiveDataViewComponentFilterViewSBConfig: Meta<InteractiveDataViewComponent> = {
  ...InteractiveDataViewComponentSBConfig,
  title: 'Components/InteractiveDataViewComponent/Filtering',
}

const defaultArgs = {
  ...defaultInteractiveDataViewArgs,
  disableFilterView: true,
  filterViewDisplayMode: 'button',
}

const defaultComponentActionsArgs = {
  ...defaultInteractiveDataViewActionsArgs,
}

const CustomContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: {
    ...args,
    ...defaultComponentActionsArgs,
  },
  template: `
    <ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
      <ng-template #list let-item>
        <div class="w-full px-4 py-2 card mb-4">
          <p>{{item.product}}</p>
          <p-progressBar [value]="item.amount" />
        </div>
      </ng-template>
      <ng-template #grid let-item>
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

export const WithFilterViewChips = {
  render: CustomContentInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

export const WithFilterViewButton = {
  render: CustomContentInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewChipsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: {
    ...args,
    ...defaultComponentActionsArgs,
  },
  template: `
    <ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
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
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewChipsByColumnInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: {
    ...args,
    ...defaultComponentActionsArgs,
  },
  template: `
    <ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
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
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: {
    ...args,
    ...defaultComponentActionsArgs,
  },
  template: `
    <ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
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
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewCellsByColumnInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: {
    ...args,
    ...defaultComponentActionsArgs,
  },
  template: `
    <ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
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
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewNoFiltersInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: {
    ...args,
    ...defaultComponentActionsArgs,
  },
  template: `
    <ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
      <ng-template pTemplate="fitlerViewNoSelection">
        <span>Filter data to display chips</span>
      </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomNoFiltersTemplate = {
  render: CustomFilterViewNoFiltersInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewChipContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: {
    ...args,
    ...defaultComponentActionsArgs,
  },
  template: `
    <ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data" filterViewChipStyleClass="pl-0 pr-3">
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
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewShowMoreChipInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: {
    ...args,
    ...defaultComponentActionsArgs,
  },
  template: `
    <ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
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
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

export const WithFilterViewCustomChipSelection = {
  render: (args: any) => ({
    props: {
      ...args,
      ...defaultComponentActionsArgs,
    },
    template: `<ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" (componentStateChanged)="componentStateChanged($event)" (selectionChanged)="selectionChanged($event)"></ocx-interactive-data-view>`,
  }),
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
    selectDisplayedChips: (filters: Filter[]) => {
      return filters.slice(0, 2).reverse()
    },
  },
}

export const WithFilterViewCustomStyles = {
  render: (args: any) => ({
    props: {
      ...args,
      ...defaultComponentActionsArgs,
    },
    template: `<ocx-interactive-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)" (componentStateChanged)="componentStateChanged($event)" (selectionChanged)="selectionChanged($event)"></ocx-interactive-data-view>`,
  }),
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
    filterViewTableStyle: { 'max-height': '30vh' },
    filterViewPanelStyle: { 'max-width': '80%' },
  },
}

export default InteractiveDataViewComponentFilterViewSBConfig
