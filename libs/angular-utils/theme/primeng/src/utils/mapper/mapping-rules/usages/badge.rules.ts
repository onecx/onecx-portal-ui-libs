import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const badgeMappingRules: MappingRule[] = [
  // Dot section
  {
    from: 'usages.badge.dot.size',
    to: 'components.badge.dot.size',
  },

  // Default variant - root properties
  {
    from: 'usages.badge.defaultVariant.background',
    to: 'components.badge.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.color',
    to: 'components.badge.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.border.radius',
    to: 'components.badge.root.borderRadius',
  },
  {
    from: 'usages.badge.defaultVariant.font.size',
    to: 'components.badge.root.fontSize',
  },
  {
    from: 'usages.badge.defaultVariant.font.weight',
    to: 'components.badge.root.fontWeight',
  },
  {
    from: 'usages.badge.defaultVariant.padding',
    to: 'components.badge.root.padding',
  },

  // Default variant - default size
  {
    from: 'usages.badge.defaultVariant.defaultVariant.minWidth',
    to: 'components.badge.root.minWidth',
  },
  {
    from: 'usages.badge.defaultVariant.defaultVariant.height',
    to: 'components.badge.root.height',
  },

  // Default variant - size variants
  {
    from: 'usages.badge.defaultVariant.sizeVariant.sm.fontSize',
    to: 'components.badge.sm.fontSize',
  },
  {
    from: 'usages.badge.defaultVariant.sizeVariant.sm.minWidth',
    to: 'components.badge.sm.minWidth',
  },
  {
    from: 'usages.badge.defaultVariant.sizeVariant.sm.height',
    to: 'components.badge.sm.height',
  },
  {
    from: 'usages.badge.defaultVariant.sizeVariant.lg.fontSize',
    to: 'components.badge.lg.fontSize',
  },
  {
    from: 'usages.badge.defaultVariant.sizeVariant.lg.minWidth',
    to: 'components.badge.lg.minWidth',
  },
  {
    from: 'usages.badge.defaultVariant.sizeVariant.lg.height',
    to: 'components.badge.lg.height',
  },
  {
    from: 'usages.badge.defaultVariant.sizeVariant.xl.fontSize',
    to: 'components.badge.xl.fontSize',
  },
  {
    from: 'usages.badge.defaultVariant.sizeVariant.xl.minWidth',
    to: 'components.badge.xl.minWidth',
  },
  {
    from: 'usages.badge.defaultVariant.sizeVariant.xl.height',
    to: 'components.badge.xl.height',
  },

  // Severity variant - primary
  {
    from: 'usages.badge.variant.primary.background',
    to: 'components.badge.primary.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.variant.primary.color',
    to: 'components.badge.primary.color',
    transform: toColorString,
  },

  // Severity variant - secondary
  {
    from: 'usages.badge.variant.secondary.background',
    to: 'components.badge.secondary.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.variant.secondary.color',
    to: 'components.badge.secondary.color',
    transform: toColorString,
  },

  // Severity variant - success
  {
    from: 'usages.badge.variant.success.background',
    to: 'components.badge.success.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.variant.success.color',
    to: 'components.badge.success.color',
    transform: toColorString,
  },

  // Severity variant - info
  {
    from: 'usages.badge.variant.info.background',
    to: 'components.badge.info.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.variant.info.color',
    to: 'components.badge.info.color',
    transform: toColorString,
  },

  // Severity variant - warning
  {
    from: 'usages.badge.variant.warning.background',
    to: 'components.badge.warn.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.variant.warning.color',
    to: 'components.badge.warn.color',
    transform: toColorString,
  },

  // Severity variant - danger
  {
    from: 'usages.badge.variant.danger.background',
    to: 'components.badge.danger.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.variant.danger.color',
    to: 'components.badge.danger.color',
    transform: toColorString,
  },

  // Severity variant - contrast
  {
    from: 'usages.badge.variant.contrast.background',
    to: 'components.badge.contrast.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.variant.contrast.color',
    to: 'components.badge.contrast.color',
    transform: toColorString,
  },
];
