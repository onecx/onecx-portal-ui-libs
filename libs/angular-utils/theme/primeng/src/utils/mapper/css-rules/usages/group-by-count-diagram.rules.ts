import type { CssRule } from '../../mapper.types'

const CONTAINER: CssRule = {
  selector: 'ocx-group-by-count-diagram',
  declarations: [
    {
      property: 'background',
      from: 'usages.groupByCountDiagram.container.background',
    },
    {
      property: 'color',
      from: 'usages.groupByCountDiagram.container.color',
    },
  ],
}

const PCHART_CONTAINER: CssRule = {
  selector: 'ocx-group-by-count-diagram .p-chart',
  declarations: [
    {
      property: 'background',
      from: 'usages.groupByCountDiagram.container.background',
    },
    {
      property: 'color',
      from: 'usages.groupByCountDiagram.container.color',
    },
  ],
}
const HEADER: CssRule = {
  selector: 'ocx-group-by-count-diagram .diagram-title',
  declarations: [
    {
      property: 'font-size',
      from: 'usages.groupByCountDiagram.header.font.size',
    },
    {
      property: 'font-weight',
      from: 'usages.groupByCountDiagram.header.font.weight',
    },
    {
      property: 'font-family',
      from: 'usages.groupByCountDiagram.header.font.family',
    },
  ],
}

const DESCRIPTION: CssRule = {
  selector: 'ocx-group-by-count-diagram .diagram-description',
  declarations: [
    {
      property: 'font-size',
      from: 'usages.groupByCountDiagram.description.font.size',
    },
    {
      property: 'font-weight',
      from: 'usages.groupByCountDiagram.description.font.weight',
    },
    {
      property: 'font-family',
      from: 'usages.groupByCountDiagram.description.font.family',
    },
  ],
}

const SELECT_BUTTON_ROOT: CssRule = {
  selector: 'ocx-group-by-count-diagram .p-selectbutton',
  declarations: [
    {
      property: 'gap',
      from: 'usages.groupByCountDiagram.selectButton.gap',
    },
    {
      property: 'border-color',
      from: 'usages.groupByCountDiagram.selectButton.border.color',
    },
    {
      property: 'border-style',
      from: 'usages.groupByCountDiagram.selectButton.border.style',
    },
    {
      property: 'border-width',
      from: 'usages.groupByCountDiagram.selectButton.border.width',
    },
    {
      property: 'border-radius',
      from: 'usages.groupByCountDiagram.selectButton.border.radius',
    },
    {
      property: 'padding-left',
      from: 'usages.groupByCountDiagram.selectButton.paddingX',
    },
    {
      property: 'padding-right',
      from: 'usages.groupByCountDiagram.selectButton.paddingY',
    }
  ],
}

const FOOTER: CssRule = {
  selector: 'ocx-group-by-count-diagram .footer',
  declarations: [
    {
      property: 'font-size',
      from: 'usages.groupByCountDiagram.footer.font.size',
    },
    {
      property: 'font-weight',
      from: 'usages.groupByCountDiagram.footer.font.weight',
    },
    {
      property: 'font-family',
      from: 'usages.groupByCountDiagram.footer.font.family',
    },
  ],
}
export const groupByCountDiagramCssRules: CssRule[] = [
  CONTAINER,
  PCHART_CONTAINER,
  HEADER,
  DESCRIPTION,
  SELECT_BUTTON_ROOT,
  FOOTER,
]
