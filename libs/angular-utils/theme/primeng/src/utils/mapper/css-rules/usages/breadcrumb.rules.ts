import { CssRule } from '../../mapper.types'

export const breadcrumbCssRules: CssRule[] = [
  {
    selector: '.p-breadcrumb .p-breadcrumb-item',
    declarations: [
      {
        property: 'font-weight',
        from: 'usages.breadcrumb.item.defaultVariant.defaultState.label.font.weight',
      },
      {
        property: 'font-size',
        from: 'usages.breadcrumb.item.defaultVariant.defaultState.label.font.size',
      },
      {
        property: 'background',
        from: 'usages.breadcrumb.item.defaultVariant.defaultState.background.color',
      },
      {
        property: 'border-color',
        from: 'usages.breadcrumb.item.defaultVariant.defaultState.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.breadcrumb.item.defaultVariant.defaultState.border.width',
      },
      {
        property: 'padding-inline',
        from: 'usages.breadcrumb.item.defaultVariant.defaultState.paddingX',
      },
      {
        property: 'padding-block',
        from: 'usages.breadcrumb.item.defaultVariant.defaultState.paddingY',
      },
    ],
  },
  {
    selector: '.p-breadcrumb .p-breadcrumb-item:not(.p-disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.breadcrumb.item.defaultVariant.hover.background.color',
      },
      {
        property: 'border-color',
        from: 'usages.breadcrumb.item.defaultVariant.hover.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.breadcrumb.item.defaultVariant.hover.border.width',
      },
    ],
  },
  {
    selector: '.p-breadcrumb .p-breadcrumb-item:not(.p-disabled):focus-visible',
    declarations: [
      {
        property: 'background',
        from: 'usages.breadcrumb.item.defaultVariant.focus.background.color',
      },
      {
        property: 'border-color',
        from: 'usages.breadcrumb.item.defaultVariant.focus.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.breadcrumb.item.defaultVariant.focus.border.width',
      },
    ],
  },
  {
    selector: '.p-breadcrumb .p-breadcrumb-item:not(.p-disabled):focus-visible .p-breadcrumb-item-link',
    declarations: [
      {
        property: 'color',
        from: 'usages.breadcrumb.item.defaultVariant.focus.color',
      },
    ],
  },
  {
    selector: '.p-breadcrumb .p-breadcrumb-item:not(.p-disabled):focus-visible .p-breadcrumb-item-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.breadcrumb.item.defaultVariant.focus.icon.color',
      },
    ],
  },
]
