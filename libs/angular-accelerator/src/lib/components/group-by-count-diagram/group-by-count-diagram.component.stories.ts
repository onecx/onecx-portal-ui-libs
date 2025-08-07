import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { ChartModule } from 'primeng/chart'
import { SelectButtonModule } from 'primeng/selectbutton'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { DiagramType } from '../../model/diagram-type'
import { GroupByCountDiagramComponent } from './group-by-count-diagram.component'
import { DiagramComponent } from '../diagram/diagram.component'
import { ColumnType } from '../../model/column-type.model'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip';

export default {
  title: 'Components/GroupByCountDiagramComponent',
  component: GroupByCountDiagramComponent,
  argTypes: {
    diagramType: {
      options: [DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR, DiagramType.PIE],
      control: { type: 'select' },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [GroupByCountDiagramComponent, DiagramComponent, DynamicPipe],
      imports: [
        MenuModule,
        BreadcrumbModule,
        ButtonModule,
        SkeletonModule,
        StorybookTranslateModule,
        ChartModule,
        SelectButtonModule,
        TooltipModule,
      ],
    }),
  ],
} as Meta<GroupByCountDiagramComponent>

const Template: StoryFn<GroupByCountDiagramComponent> = (args) => ({
  props: args,
})

const mockData = [
  {
    id: 1,
    fruitType: 'Apple',
    name: 'Apple1',
  },
  {
    id: 2,
    fruitType: 'Apple',
    name: 'Apple2',
  },
  {
    id: 3,
    fruitType: 'Apple',
    name: 'Apple3',
  },
  {
    id: 4,
    fruitType: 'Banana',
    name: 'Banana1',
  },
  {
    id: 5,
    fruitType: 'Banana',
    name: 'Banana2',
  },
]

export const PieChart = {
  render: Template,

  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
  },
}

export const HorizontalBarChart = {
  render: Template,

  args: {
    diagramType: DiagramType.HORIZONTAL_BAR,
    data: mockData,
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
  },
}

export const VerticalBarChart = {
  render: Template,

  args: {
    diagramType: DiagramType.VERTICAL_BAR,
    data: mockData,
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
  },
}

export const WithDiagramTypeSelection = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
  },
}

export const WithCustomColors = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
    colors: {
      ['Apple']: 'green',
      ['Banana']: 'yellow',
    },
  },
}

export const WithForcedCustomColors = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
    colors: {
      ['Apple']: 'green',
    },
    fillMissingColors: true,
  },
}
