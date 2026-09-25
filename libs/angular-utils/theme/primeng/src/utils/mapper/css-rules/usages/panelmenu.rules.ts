import type { CssRule } from '../../mapper.types'

// CSS rules for properties that have no PrimeNG preset equivalent.
export const panelmenuCssRules: CssRule[] = [
  {
    selector: '.p-panelmenu-header-content',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.defaultState.color' },
      { property: 'gap', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.defaultState.gap' },
      { property: 'padding', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.defaultState.padding' },
      {
        property: 'border-radius',
        from: 'usages.panelmenu.defaultVariant.header.defaultVariant.defaultState.borderRadius',
      },
    ],
  },
  {
    selector: '.p-panelmenu-header-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.defaultState.icon.color' },
    ],
  },
  {
    selector: '.p-panelmenu-header .p-panelmenu-submenu-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.panelmenu.defaultVariant.header.defaultVariant.defaultState.submenuIcon.color',
      },
    ],
  },
  {
    selector:
      '.p-panelmenu-header:not(.p-disabled):focus-visible .p-panelmenu-header-content, .p-panelmenu-header:not(.p-disabled) .p-panelmenu-header-content:hover',
    declarations: [
      { property: 'background', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.hover.background' },
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.hover.color' },
    ],
  },
  {
    selector:
      '.p-panelmenu-header:not(.p-disabled):focus-visible .p-panelmenu-header-content .p-panelmenu-header-icon, .p-panelmenu-header:not(.p-disabled) .p-panelmenu-header-content:hover .p-panelmenu-header-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.hover.icon.color' },
    ],
  },
  {
    selector:
      '.p-panelmenu-header:not(.p-disabled):focus-visible .p-panelmenu-header-content .p-panelmenu-submenu-icon, .p-panelmenu-header:not(.p-disabled) .p-panelmenu-header-content:hover .p-panelmenu-submenu-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.hover.submenuIcon.color' },
    ],
  },

  // Disabled — overrides PrimeNG's global `.p-disabled` opacity rule for this component
  // with the schema's own per-component disabled tokens (see note above).
  {
    selector: '.p-panelmenu-header.p-disabled .p-panelmenu-header-content',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.disabled.color' },
      { property: 'opacity', value: '1' },
    ],
  },
  {
    selector: '.p-panelmenu-header.p-disabled .p-panelmenu-header-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.disabled.icon.color' },
    ],
  },
  {
    selector: '.p-panelmenu-header.p-disabled .p-panelmenu-submenu-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.disabled.submenuIcon.color' },
    ],
  },
  {
    selector: '.p-panelmenu-item.p-disabled > .p-panelmenu-item-content',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.item.defaultVariant.disabled.color' },
      { property: 'opacity', value: '1' },
    ],
  },
  {
    selector: '.p-panelmenu-item.p-disabled > .p-panelmenu-item-content .p-panelmenu-item-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.item.defaultVariant.disabled.icon.color' },
    ],
  },
  {
    selector: '.p-panelmenu-item.p-disabled > .p-panelmenu-item-content .p-panelmenu-submenu-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.item.defaultVariant.disabled.submenuIcon.color' },
    ],
  },

  // Selected — the current navigation destination. PrimeNG applies `p-panelmenu-item-link-active`
  // via `[routerLinkActive]` directly on the header/item link element (unstyled by default).
  {
    selector: '.p-panelmenu-header-link.p-panelmenu-item-link-active',
    declarations: [
      { property: 'background', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.selected.background' },
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.selected.color' },
      {
        property: 'border-radius',
        from: 'usages.panelmenu.defaultVariant.header.defaultVariant.defaultState.borderRadius',
      },
    ],
  },
  {
    selector: '.p-panelmenu-header-link.p-panelmenu-item-link-active .p-panelmenu-header-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.selected.icon.color' },
    ],
  },
  {
    selector: '.p-panelmenu-header-link.p-panelmenu-item-link-active .p-panelmenu-submenu-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.header.defaultVariant.selected.submenuIcon.color' },
    ],
  },
  {
    selector: '.p-panelmenu-item-link.p-panelmenu-item-link-active',
    declarations: [
      { property: 'background', from: 'usages.panelmenu.defaultVariant.item.defaultVariant.selected.background' },
      { property: 'color', from: 'usages.panelmenu.defaultVariant.item.defaultVariant.selected.color' },
      {
        property: 'border-radius',
        from: 'usages.panelmenu.defaultVariant.item.defaultVariant.defaultState.borderRadius',
      },
    ],
  },
  {
    selector: '.p-panelmenu-item-link.p-panelmenu-item-link-active .p-panelmenu-item-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.item.defaultVariant.selected.icon.color' },
    ],
  },
  {
    selector: '.p-panelmenu-item-link.p-panelmenu-item-link-active .p-panelmenu-submenu-icon',
    declarations: [
      { property: 'color', from: 'usages.panelmenu.defaultVariant.item.defaultVariant.selected.submenuIcon.color' },
    ],
  },
]
