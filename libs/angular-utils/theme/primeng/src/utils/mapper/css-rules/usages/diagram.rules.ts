import type { CssRule } from '../../mapper.types'

const CONTAINER: CssRule = {
  selector: 'ocx-diagram',
  declarations: [
    {
      property: 'background',
      from: 'usages.diagram.container.background',
    },
    {
      property: 'color',
      from: 'usages.diagram.container.color',
    },
  ],
}

const PCHART_CONTAINER: CssRule = {
  selector: 'ocx-diagram .p-chart',
  declarations: [
    {
      property: 'background',
      from: 'usages.diagram.container.background',
    },
    {
      property: 'color',
      from: 'usages.diagram.container.color',
    },
  ],
}
const HEADER: CssRule = {
  selector: 'ocx-diagram .diagram-title',
  declarations: [
    {
      property: 'font-size',
      from: 'usages.diagram.header.font.size',
    },
    {
      property: 'font-weight',
      from: 'usages.diagram.header.font.weight',
    },
    {
      property: 'font-family',
      from: 'usages.diagram.header.font.family',
    },
  ],
}

const DESCRIPTION: CssRule = {
  selector: 'ocx-diagram .diagram-description',
  declarations: [
    {
      property: 'font-size',
      from: 'usages.diagram.description.font.size',
    },
    {
      property: 'font-weight',
      from: 'usages.diagram.description.font.weight',
    },
    {
      property: 'font-family',
      from: 'usages.diagram.description.font.family',
    },
  ],
}

const SELECT_BUTTON_ROOT: CssRule = {
  selector: 'ocx-diagram .p-selectbutton',
  declarations: [
    {
      property: 'gap',
      from: 'usages.diagram.selectButton.gap',
    },
    {
      property: 'border-color',
      from: 'usages.diagram.selectButton.border.color',
    },
    {
      property: 'border-style',
      from: 'usages.diagram.selectButton.border.style',
    },
    {
      property: 'border-width',
      from: 'usages.diagram.selectButton.border.width',
    },
    {
      property: 'border-radius',
      from: 'usages.diagram.selectButton.border.radius',
    },
    {
      property: 'padding-left',
      from: 'usages.diagram.selectButton.paddingX',
    },
    {
      property: 'padding-right',
      from: 'usages.diagram.selectButton.paddingY',
    },
  ],
}
const FOOTER: CssRule = {
  selector: 'ocx-diagram .footer',
  declarations: [
    {
      property: 'font-size',
      from: 'usages.diagram.footer.font.size',
    },
    {
      property: 'font-weight',
      from: 'usages.diagram.footer.font.weight',
    },
    {
      property: 'font-family',
      from: 'usages.diagram.footer.font.family',
    },
  ],
}
export const diagramCssRules: CssRule[] = [
  CONTAINER,
  PCHART_CONTAINER,
  HEADER,
  DESCRIPTION,
  SELECT_BUTTON_ROOT,
  FOOTER,
]
