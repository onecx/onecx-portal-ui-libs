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
  ],
}

const SELECT_BUTTON_ICON: CssRule = {
  selector: 'ocx-group-by-count-diagram .p-selectbutton .p-button-icon',
  declarations: [
    {
      property: 'color',
      from: 'usages.groupByCountDiagram.selectButton.button.icon.color',
    },
  ],
}

const SELECT_BUTTON: CssRule = {
  selector: 'ocx-group-by-count-diagram .p-selectbutton .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.groupByCountDiagram.selectButton.button.background',
    },
    {
      property: 'border-color',
      from: 'usages.groupByCountDiagram.selectButton.button.border.color',
    },
    {
      property: 'color',
      from: 'usages.groupByCountDiagram.selectButton.button.color',
    },
  ],
}

const SELECT_BUTTON_STATES_HOVER: CssRule = {
  selector: 'ocx-group-by-count-diagram .p-selectbutton .p-togglebutton:hover .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.groupByCountDiagram.selectButton.button.hover.background',
    },
    {
      property: 'color',
      from: 'usages.groupByCountDiagram.selectButton.button.hover.color',
    },
    {
      property: 'border-color',
      from: 'usages.groupByCountDiagram.selectButton.button.hover.border.color',
    }
  ]
}

const SELECT_BUTTON_STATES_SELECTED: CssRule = {
  selector: 'ocx-group-by-count-diagram .p-selectbutton .p-togglebutton-checked .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.groupByCountDiagram.selectButton.button.selected.background',
    },
    {
      property: 'color',
      from: 'usages.groupByCountDiagram.selectButton.button.selected.color',
    },
    {
      property: 'border-color',
      from: 'usages.groupByCountDiagram.selectButton.button.selected.border.color',
    }
  ]
}

const SELECT_BUTTON_STATES_FOCUS: CssRule = {
  selector: 'ocx-group-by-count-diagram .p-selectbutton .p-togglebutton:focus-within .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.groupByCountDiagram.selectButton.button.focus.background',
    },
    {
      property: 'color',
      from: 'usages.groupByCountDiagram.selectButton.button.focus.color',
    },
    {
      property: 'border-color',
      from: 'usages.groupByCountDiagram.selectButton.button.focus.border.color',
    }
  ]
}

const SELECT_BUTTON_STATE_ICONS: CssRule[] = [
  {
    selector: 'ocx-group-by-count-diagram .p-selectbutton .p-togglebutton:hover .p-button-icon',
    declarations: [{ property: 'color', from: 'usages.groupByCountDiagram.selectButton.button.hover.color' }],
  },
  {
    selector: 'ocx-group-by-count-diagram .p-selectbutton .p-togglebutton-checked .p-button-icon',
    declarations: [{ property: 'color', from: 'usages.groupByCountDiagram.selectButton.button.selected.color' }],
  },
  {
    selector: 'ocx-group-by-count-diagram .p-selectbutton .p-togglebutton:focus-within .p-button-icon',
    declarations: [{ property: 'color', from: 'usages.groupByCountDiagram.selectButton.button.focus.color' }],
  },
]

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
  SELECT_BUTTON_ICON,
  SELECT_BUTTON,
  SELECT_BUTTON_STATES_HOVER,
  SELECT_BUTTON_STATES_SELECTED,
  SELECT_BUTTON_STATES_FOCUS,
  ...SELECT_BUTTON_STATE_ICONS,
  FOOTER,
]
