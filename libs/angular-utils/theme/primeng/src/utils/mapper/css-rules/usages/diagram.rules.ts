import type { CssRule } from '../../mapper.types'

const CONTAINER: CssRule = {
  selector: 'ocx-diagram',
  declarations: [
    {
      property: 'background',
      from: 'usages.diagram.container.bgContrast.bg',
    },
    {
      property: 'color',
      from: 'usages.diagram.container.bgContrast.contrast',
    },
  ],
}

const PCHART_CONTAINER: CssRule = {
  selector: 'ocx-diagram .p-chart',
  declarations: [
    {
      property: 'background',
      from: 'usages.diagram.container.bgContrast.bg',
    },
    {
      property: 'color',
      from: 'usages.diagram.container.bgContrast.contrast',
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

const SELECT_BUTTON_ICON: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-button-icon',
  declarations: [
    {
      property: 'color',
      from: 'usages.diagram.selectButton.icon.color',
    },
  ],
}

const SELECT_BUTTON: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton-content',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.bgContrast.bg',
    },
    {
      property: 'border-color',
      from: 'usages.diagram.selectButton.border',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.bgContrast.contrast',
    },
  ],
}

const SELECT_BUTTON_STATES_HOVER: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton-content:hover',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.bgContrast.bg',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.bgContrast.contrast',
    }
  ]
}

const SELECT_BUTTON_STATES_ACTIVE: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton-content:active',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.bgContrast.bg',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.bgContrast.contrast',
    }
  ]
}

const SELECT_BUTTON_STATES_SELECTED: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton-content:selected',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.bgContrast.bg',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.bgContrast.contrast',
    }
  ]
}

const SELECT_BUTTON_STATES_FOCUS: CssRule = {
  selector: 'ocx-diagram .p-selectbutton .p-togglebutton-content:focus',
  declarations: [
    {
      property: 'background-color',
      from: 'usages.diagram.selectButton.bgContrast.bg',
    },
    {
      property: 'color',
      from: 'usages.diagram.selectButton.bgContrast.contrast',
    }
  ]
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
  SELECT_BUTTON_ICON,
  SELECT_BUTTON,
  SELECT_BUTTON_STATES_HOVER,
  SELECT_BUTTON_STATES_ACTIVE,
  SELECT_BUTTON_STATES_SELECTED,
  SELECT_BUTTON_STATES_FOCUS,
  FOOTER,
]
