import type { CssRule } from '../../mapper.types';
const CONTAINER: CssRule = {
    selector: 'ocx-diagram',
    declarations: [
        {
            property: 'background',
            from: 'usages.diagram.container.bg'
        },
        {
            property: 'color',
            from: 'usages.diagram.container.contrast'
        }
    ]
}

const PCHART_CONTAINER: CssRule = {
    selector: 'ocx-diagram .p-chart',
    declarations: [
        {
            property: 'background',
            from: 'usages.diagram.container.bg'
        },
        {
            property: 'color',
            from: 'usages.diagram.container.contrast'
        }
    ]
}
const HEADER: CssRule = {
    selector: 'ocx-diagram .diagram-title',
    declarations: [
        {
            property: 'font-size',
            from: 'usages.diagram.header.font.size'
        },
        {
            property: 'font-weight',
            from: 'usages.diagram.header.font.weight'
        }
    ]
}

const DESCRIPTION: CssRule = {
    selector: 'ocx-diagram .diagram-description',
    declarations: [
        {
            property: 'font-size',
            from: 'usages.diagram.description.font.size'
        },
        {
            property: 'font-weight',
            from: 'usages.diagram.description.font.weight'
        }
    ]
}

const SELECT_BUTTON_ICON: CssRule = {
    selector: 'ocx-diagram .p-selectbutton .p-button-icon',
    declarations: [
        {
            property: 'color',
            from: 'usages.diagram.selectButton.icon.color'
        }
    ]
}

const SELECT_BUTTON: CssRule = 
    {
        selector: 'ocx-diagram .p-selectbutton .p-togglebutton-content',
        declarations: [
        {
            property: 'background-color',
            from: 'usages.diagram.selectButton.backgroundColor'
        },
        {
            property: 'border-color',
            from: 'usages.diagram.selectButton.border'
        },
        {
            property: 'color',
            from: 'usages.diagram.selectButton.color'
        }]
    }


const FOOTER: CssRule = {
    selector: 'ocx-diagram .footer',
    declarations: [
        {
            property: 'font-size',
            from: 'usages.diagram.footer.font.size'
        },
        {
            property: 'font-weight',
            from: 'usages.diagram.footer.font.weight'
        }
    ]
}
export const diagramCssRules: CssRule[] = [CONTAINER, PCHART_CONTAINER, HEADER, DESCRIPTION, SELECT_BUTTON_ICON, SELECT_BUTTON, FOOTER]