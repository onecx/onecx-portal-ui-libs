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

export const mockData2: DiagramData[] = [
  {
    label: 'Apple',
    value: 12,
  },
  {
    label: 'Banana',
    value: 9,
  },
  {
    label: 'Cherry',
    value: 6,
  },
  {
    label: 'Date',
    value: 4,
  },
  {
    label: 'Elderberry',
    value: 5,
  },
  {
    label: 'Fig',
    value: 3,
  },
  {
    label: 'Grape',
    value: 8,
  },
  {
    label: 'Honeydew',
    value: 2,
  },
  {
    label: 'Kiwi',
    value: 7,
  },
  {
    label: 'Lemon',
    value: 4,
  },
  {
    label: 'Mango',
    value: 11,
  },
  {
    label: 'Nectarine',
    value: 5,
  },
  {
    label: 'Orange',
    value: 10,
  },
  {
    label: 'Papaya',
    value: 6,
  },
  {
    label: 'Quince',
    value: 3,
  },
  {
    label: 'Raspberry',
    value: 4,
  },
  {
    label: 'Strawberry',
    value: 9,
  },
  {
    label: 'Tangerine',
    value: 5,
  },
  {
    label: 'Ugli Fruit',
    value: 2,
  },
  {
    label: 'Watermelon',
    value: 8,
  }
]

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
      declarations: [DiagramComponent, DynamicPipe],
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

const TemplateWithContainer: StoryFn<DiagramComponent> = (args) => ({
  template: `
    <div class="flex justify-content-center">
    <div style="height: 350px; width:350px"> <!--Container should have fixed height-->
      <ocx-diagram
        [diagramType]="diagramType"
        [data]="data"
        [sumKey]="sumKey"
        [supportedDiagramTypes]="supportedDiagramTypes"
        [fillMissingColors]="fillMissingColors"
        [responsiveHeight]="true"     
      ></ocx-diagram>
      </div>
    </div>
  `,
  props: args,
})

export const WithEnabledResponsiveHeight = {
  render: TemplateWithContainer,
  args: {
    diagramType: DiagramType.PIE,
    data: [
      ...mockData2,
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