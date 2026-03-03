import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { ChartModule } from 'primeng/chart'
import { SelectButtonModule } from 'primeng/selectbutton'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { DiagramComponent } from './diagram.component'
import { DiagramType } from '../../model/diagram-type'
import { DiagramData } from '../../model/diagram-data'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip';
import { OcxTooltipDirective } from '../../directives/ocx-tooltip.directive'

export default {
  title: 'Components/DiagramComponent',
  component: DiagramComponent,
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
      declarations: [DiagramComponent, DynamicPipe, OcxTooltipDirective],
      imports: [
        MenuModule,
        BreadcrumbModule,
        ButtonModule,
        SkeletonModule,
        StorybookTranslateModule,
        ChartModule,
        SelectButtonModule,
        FormsModule,
        TooltipModule,
      ],
    }),
  ],
} as Meta<DiagramComponent>

const Template: StoryFn<DiagramComponent> = (args) => ({
  props: args,
})

const mockData: DiagramData[] = [
  {
    label: 'Apples',
    value: 10,
  },
  {
    label: 'Bananas',
    value: 7,
  },
  {
    label: 'Oranges',
    value: 3,
  },
]

export const PieChart = {
  render: Template,

  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
  },
}

export const HorizontalBarChart = {
  render: Template,

  args: {
    diagramType: DiagramType.HORIZONTAL_BAR,
    data: mockData,
  },
}

export const VerticalBarChart = {
  render: Template,

  args: {
    diagramType: DiagramType.VERTICAL_BAR,
    data: mockData,
  },
}

export const WithDiagramTypeSelection = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
  },
}

const mockDataWithColors: DiagramData[] = [
  {
    label: 'Apples',
    value: 10,
    backgroundColor: 'yellow',
  },
  {
    label: 'Bananas',
    value: 7,
    backgroundColor: 'orange',
  },
  {
    label: 'Oranges',
    value: 3,
    backgroundColor: 'red',
  },
]

export const WithCustomColors = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockDataWithColors,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
  },
}

export const WithForcedCustomColors = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: [
      ...mockData,
      {
        label: 'Peaches',
        value: 2,
        backgroundColor: 'Yellow',
      },
    ],
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
    fillMissingColors: true,
  },
}
