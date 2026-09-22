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
  ],
}

const SELECT_BUTTON_ICON: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-button-icon',
  declarations: [
    {
      property: 'color',
      from: 'usages.diagram.selectButton.button.icon.color',
    },
  ],
}

const SELECT_BUTTON: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.button.background',
    },
    {
      property: 'border-color',
      from: 'usages.diagram.selectButton.button.border.color',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.button.color',
    },
  ],
}

const SELECT_BUTTON_STATES_HOVER: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton:hover .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.button.hover.background',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.button.hover.color',
    },
    {
      property: 'border-color',
      from: 'usages.diagram.selectButton.button.hover.border.color',
    }
  ]
}

const SELECT_BUTTON_STATES_SELECTED: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton-checked .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.button.selected.background',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.button.selected.color',
    },
    {
      property: 'border-color',
      from: 'usages.diagram.selectButton.button.selected.border.color',
    }
  ]
}

const SELECT_BUTTON_STATES_FOCUS: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton:focus-within .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.button.focus.background',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.button.focus.color',
    },
    {
      property: 'border-color',
      from: 'usages.diagram.selectButton.button.focus.border.color',
    }
  ]
}

const SELECT_BUTTON_STATE_ICONS: CssRule[] = [
  {
    selector: 'ocx-diagram .p-selectbutton .p-togglebutton:hover .p-button-icon',
    declarations: [{ property: 'color', from: 'usages.diagram.selectButton.button.hover.color' }],
  },
  {
    selector: 'ocx-diagram .p-selectbutton .p-togglebutton-checked .p-button-icon',
    declarations: [{ property: 'color', from: 'usages.diagram.selectButton.button.selected.color' }],
  },
  {
    selector: 'ocx-diagram .p-selectbutton .p-togglebutton:focus-within .p-button-icon',
    declarations: [{ property: 'color', from: 'usages.diagram.selectButton.button.focus.color' }],
  },
]

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
  SELECT_BUTTON_ICON,
  SELECT_BUTTON,
  SELECT_BUTTON_STATES_HOVER,
  SELECT_BUTTON_STATES_SELECTED,
  SELECT_BUTTON_STATES_FOCUS,
  ...SELECT_BUTTON_STATE_ICONS,
  FOOTER,
]
