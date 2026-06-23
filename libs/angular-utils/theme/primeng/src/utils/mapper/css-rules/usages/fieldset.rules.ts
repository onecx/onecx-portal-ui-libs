import { CssRule } from "../../mapper.types";

const FIELDSET_TOGGLE_ICON: CssRule[] = [
{
    selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-toggle-icon',
    declarations: [{
        property: 'opacity',
        from: 'usages.fieldset.toggleIcon.opacity',
    },
    {
        property: 'width',
        from: 'usages.fieldset.toggleIcon.size',
    },
]
}];

const FIELDSET_CONTENT: CssRule[] = [
{
    selector: '.p-fieldset .p-fieldset-content-container .p-fieldset-content',
    declarations: [
    {
        property: 'background-color',
        from: 'usages.fieldset.contentContainer.bg.color'
    },
    {
        property: 'color',
        from: 'usages.fieldset.contentContainer.contrast',
    },
    {
        property: 'font-size',
        from: 'usages.fieldset.content.font.size',
    },
    {
        property: 'gap',
        from: 'usages.fieldset.content.gap',
    },
    {
        property: 'padding',
        from: 'usages.fieldset.content.padding',
    },
]
}];

export const fieldsetCssRules: CssRule[] = [
    ...FIELDSET_TOGGLE_ICON,
    ...FIELDSET_CONTENT
]