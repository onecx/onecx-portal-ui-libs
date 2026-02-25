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

function generateGroupByCountMockData(fruitCount = 10, itemsPerFruit = 2) {
  const fruits = Array.from({ length: fruitCount }, (_, i) => `Fruit ${i + 1}`)

  let id = 1
  const data: { id: number; fruitType: string; name: string }[] = []
  const fruitNames = fruits.slice(0, fruitCount)

  fruitNames.forEach((fruit, index) => {
    for (let i = 0; i < itemsPerFruit; i++) {
      data.push({
        id: id++,
        fruitType: `chart.fruit${index + 1}`,
        name: `${fruit}${i + 1}`,
      })
    }
  })

  return data
}

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
  }
]


const mockDataWithTranslationKeys = [
  {
    id: 1,
    fruitType: 'chart.fruit1',
    name: 'Apple1',
  },
  {
    id: 2,
    fruitType: 'chart.fruit1',
    name: 'Apple2',
  },
  {
    id: 3,
    fruitType: 'chart.fruit1',
    name: 'Apple3',
  },
  {
    id: 4,
    fruitType: 'chart.fruit2',
    name: 'Banana1',
  },
  {
    id: 5,
    fruitType: 'chart.fruit2',
    name: 'Banana2',
  }
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

export const withAllLabels = {
  render: Template,
  args: {
    diagramType: DiagramType.VERTICAL_BAR,
    data: mockData,
    sumKey: 'With all Labels',
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    fillMissingColors: false,
    showAllLabels: false,
    columnType: ColumnType.TRANSLATION_KEY,
    allLabels: ['Apple', 'Banana', 'Orange']
  },
}

export const withAllLabelAndTranslationKeys = {
  render: Template,
  args: {
    diagramType: DiagramType.VERTICAL_BAR,
    data: mockDataWithTranslationKeys,
    sumKey: 'With all labels and translation keys',
    column: {
      id: 'fruitType',
      columnType: ColumnType.TRANSLATION_KEY,
    },
    fillMissingColors: false,
    showAllLabels: true,
    allLabelKeys: ['chart.fruit1', 'chart.fruit2', 'chart.fruit3']
  }
}

const TemplateWithContainer: StoryFn<DiagramComponent> = (args) => ({
  template: `
    <div class="flex justify-content-center">
    <div style="height: 450px; width:350px;"> <!--Container should have fixed height-->
      <ocx-group-by-count-diagram
        [diagramType]="diagramType"
        [data]="data"
        [sumKey]="sumKey"
        [column]="column"
        [fillMissingColors]="fillMissingColors"
        [showAllLabels]="showAllLabels"
        [allLabelKeys]="allLabelKeys"
        [responsiveHeight]="true"     
      ></ocx-group-by-count-diagram>
      </div>
    </div>
  `,
  props: args,
})

export const withResponsiveHeight = {
  render: TemplateWithContainer,
  args: {
    diagramType: DiagramType.PIE,
    data: generateGroupByCountMockData(20, 1),
    sumKey: 'Responsive Height Enabled',
    column: {
      id: 'fruitType',
      columnType: ColumnType.TRANSLATION_KEY,
    },
    fillMissingColors: false,
    showAllLabels: true,
    allLabelKeys: ['chart.fruit1', 'chart.fruit2', 'chart.fruit3', 'chart.fruit4', 'chart.fruit5', 'chart.fruit6', 'chart.fruit7', 'chart.fruit8', 'chart.fruit9', 'chart.fruit10', 'chart.fruit11', 'chart.fruit12', 'chart.fruit13', 'chart.fruit14', 'chart.fruit15', 'chart.fruit16', 'chart.fruit17', 'chart.fruit18', 'chart.fruit19', 'chart.fruit20']
  }
}