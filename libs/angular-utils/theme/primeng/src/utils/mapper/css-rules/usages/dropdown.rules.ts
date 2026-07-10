import type { CssRule } from '../../mapper.types'

export const dropdownCssRules: CssRule[] = [
  {
    selector: '.p-select-option',
    declarations: [
      {
        property: 'border-radius',
        from: 'usages.dropdown.option.border.radius',
      },
    ],
  },
  {
    selector: '.p-select-option-label',
    declarations: [
      {
        property: 'font-weight',
        from: 'usages.dropdown.option.font.weight',
      },
      {
        property: 'font-size',
        from: 'usages.dropdown.option.font.size',
      },
    ],
  },
  {
    selector: '.p-select-option-group-label',
    declarations: [
      {
        property: 'font-weight',
        from: 'usages.dropdown.option.group.font.weight',
      },
      {
        property: 'font-size',
        from: 'usages.dropdown.option.group.font.size',
      },
    ],
  },
  {
    selector: '.p-select-option.p-select-option-selected .p-select-option-label, .p-select-label',
    declarations: [
      {
        property: 'font-weight',
        from: 'usages.dropdown.option.selected.font.weight',
      },
    ],
  },
]
