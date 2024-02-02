import { Meta, moduleMetadata, applicationConfig, StoryFn } from '@storybook/angular';
import { DataTableComponent } from "./data-table.component";
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColumnType } from '../../../model/column-type.model';
type DataTableInputTypes = Pick<DataTableComponent, 'rows' | 'columns' | 'emptyResultsMessage' | 'selectedRows'>
const DataTableComponentSBConfig: Meta<DataTableComponent>  = {
    title: 'DataTableComponent',
    component: DataTableComponent,
    decorators: [
        applicationConfig({
            providers: [
                importProvidersFrom(BrowserModule),
                importProvidersFrom(BrowserAnimationsModule),
                importProvidersFrom(TranslateModule.forRoot({})),         
            ]
        }),
        moduleMetadata({
            declarations: [DataTableComponent],
            imports: [
                TableModule,
                TranslateModule,
                ButtonModule,
                MultiSelectModule
            ]
        })
    ]
}
const Template: StoryFn = (args) => ({
    props: args,
})

const defaultComponentArgs: DataTableInputTypes = {
    columns: [
        {
            id: "product",
            columnType: ColumnType.STRING,
            nameKey: "Product",
            sortable: false
        },
        {
            id: "amount",
            columnType: ColumnType.NUMBER,
            nameKey: "Amount",
            sortable: true
        }
    ],
    rows: [
        {
           id: 1,
           product: "Apples",
           amount: 2
        },
        {
            id: 2,
            product: "Bananas",
            amount: 10
         },
         {
            id: 3,
            product: "Strawberries",
            amount: 5
         } 
    ],
    emptyResultsMessage: "No results",
    selectedRows: []
}

export const WithMockData = {
    render: Template,
    args: defaultComponentArgs,
}

export const NoData = {
    render: Template,
    args: {
        ...defaultComponentArgs,
        rows: [],
    }
}

export const WithRowSelection = {
    argTypes: {
        selectionChanged: {action: 'selectionChanged'}
    },
    render: Template,
    args: {
        ...defaultComponentArgs,
        selectionChanged: ($event: any) => console.log("Selection changed ", $event)
    }
}

export const WithRowSelectionAndDefaultSelection = {
    argTypes: {
        selectionChanged: {action: 'selectionChanged'}
    },
    render: Template,
    args: {
        ...defaultComponentArgs,
        selectionChanged: ($event: any) => console.log("Selection changed ", $event),
        selectedRows: [
            {
                id: 1
            }
        ]
    }
}

export default DataTableComponentSBConfig;