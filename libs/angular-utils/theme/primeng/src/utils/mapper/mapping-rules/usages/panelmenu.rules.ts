import type { MappingRule } from '../../mapper.types'

export const panelmenuMappingRules: MappingRule[] = [
  // Root
  {
    from: 'usages.panelmenu.gap',
    to: 'components.panelmenu.root.gap',
  },
  {
    from: 'usages.panelmenu.transitionDuration',
    to: 'components.panelmenu.root.transitionDuration',
  },

  // Panel
  {
    from: 'usages.panelmenu.defaultVariant.panel.background',
    to: 'components.panelmenu.panel.background',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.color',
    to: 'components.panelmenu.panel.color',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.padding',
    to: 'components.panelmenu.panel.padding',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.border.color',
    to: 'components.panelmenu.panel.borderColor',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.border.width',
    to: 'components.panelmenu.panel.borderWidth',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.border.radius',
    to: 'components.panelmenu.panel.borderRadius',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.first.borderWidth',
    to: 'components.panelmenu.panel.first.borderWidth',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.first.topBorderRadius',
    to: 'components.panelmenu.panel.first.topBorderRadius',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.last.borderWidth',
    to: 'components.panelmenu.panel.last.borderWidth',
  },
  {
    from: 'usages.panelmenu.defaultVariant.panel.last.bottomBorderRadius',
    to: 'components.panelmenu.panel.last.bottomBorderRadius',
  },

  // Item — the shared `panelmenu.item.*` / `panelmenu.submenuIcon.*` preset tokens.
  // The header row (usages.panelmenu.defaultVariant.header.*) renders through the
  // exact same upstream tokens, so it is wired independently via scoped CssRule
  // overrides instead (see css-rules/usages/panelmenu.rules.ts) rather than a
  // second, silently-overwriting mapping rule to the same preset path.
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.defaultState.color',
    to: 'components.panelmenu.item.color',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.defaultState.gap',
    to: 'components.panelmenu.item.gap',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.defaultState.padding',
    to: 'components.panelmenu.item.padding',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.defaultState.borderRadius',
    to: 'components.panelmenu.item.borderRadius',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.defaultState.icon.color',
    to: 'components.panelmenu.item.icon.color',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.defaultState.submenuIcon.color',
    to: 'components.panelmenu.submenuIcon.color',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.hover.background',
    to: 'components.panelmenu.item.focusBackground',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.hover.color',
    to: 'components.panelmenu.item.focusColor',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.hover.icon.color',
    to: 'components.panelmenu.item.icon.focusColor',
  },
  {
    from: 'usages.panelmenu.defaultVariant.item.defaultVariant.hover.submenuIcon.color',
    to: 'components.panelmenu.submenuIcon.focusColor',
  },

  // Submenu indent (nested <ul> wrapper for an item's own children)
  {
    from: 'usages.panelmenu.defaultVariant.item.submenu.indent',
    to: 'components.panelmenu.submenu.indent',
  },
]
