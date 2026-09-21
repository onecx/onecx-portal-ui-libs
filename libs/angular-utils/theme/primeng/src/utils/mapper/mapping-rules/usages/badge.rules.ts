import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const badgeMappingRules: MappingRule[] = [
  // Dot section
  {
    from: 'usages.badge.dot.size',
    to: 'components.badge.dot.size',
  },

  // Default variant / default severity - root properties
  {
    from: 'usages.badge.defaultVariant.defaultSeverity.border.radius',
    to: 'components.badge.root.borderRadius',
  },
  {
    from: 'usages.badge.defaultVariant.defaultSeverity.font.size',
    to: 'components.badge.root.fontSize',
  },
  {
    from: 'usages.badge.defaultVariant.defaultSeverity.font.weight',
    to: 'components.badge.root.fontWeight',
  },
  {
    from: 'usages.badge.defaultVariant.defaultSeverity.padding',
    to: 'components.badge.root.padding',
  },
  {
    from: 'usages.badge.defaultVariant.defaultSeverity.minWidth',
    to: 'components.badge.root.minWidth',
  },
  {
    from: 'usages.badge.defaultVariant.defaultSeverity.height',
    to: 'components.badge.root.height',
  },

  // Root-level size overrides
  {
    from: 'usages.badge.sm.fontSize',
    to: 'components.badge.sm.fontSize',
  },
  {
    from: 'usages.badge.sm.minWidth',
    to: 'components.badge.sm.minWidth',
  },
  {
    from: 'usages.badge.sm.height',
    to: 'components.badge.sm.height',
  },
  {
    from: 'usages.badge.lg.fontSize',
    to: 'components.badge.lg.fontSize',
  },
  {
    from: 'usages.badge.lg.minWidth',
    to: 'components.badge.lg.minWidth',
  },
  {
    from: 'usages.badge.lg.height',
    to: 'components.badge.lg.height',
  },
  {
    from: 'usages.badge.xl.fontSize',
    to: 'components.badge.xl.fontSize',
  },
  {
    from: 'usages.badge.xl.minWidth',
    to: 'components.badge.xl.minWidth',
  },
  {
    from: 'usages.badge.xl.height',
    to: 'components.badge.xl.height',
  },

  // Severity tag - primary
  {
    from: 'usages.badge.defaultVariant.primary.background',
    to: 'components.badge.primary.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.primary.color',
    to: 'components.badge.primary.color',
    transform: toColorString,
  },

  // Severity tag - secondary
  {
    from: 'usages.badge.defaultVariant.secondary.background',
    to: 'components.badge.secondary.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.secondary.color',
    to: 'components.badge.secondary.color',
    transform: toColorString,
  },

  // Severity tag - success
  {
    from: 'usages.badge.defaultVariant.success.background',
    to: 'components.badge.success.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.success.color',
    to: 'components.badge.success.color',
    transform: toColorString,
  },

  // Severity tag - info
  {
    from: 'usages.badge.defaultVariant.info.background',
    to: 'components.badge.info.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.info.color',
    to: 'components.badge.info.color',
    transform: toColorString,
  },

  // Severity tag - warning (mapped to PrimeNG's `warn` key)
  {
    from: 'usages.badge.defaultVariant.warning.background',
    to: 'components.badge.warn.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.warning.color',
    to: 'components.badge.warn.color',
    transform: toColorString,
  },

  // Severity tag - danger
  {
    from: 'usages.badge.defaultVariant.danger.background',
    to: 'components.badge.danger.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.danger.color',
    to: 'components.badge.danger.color',
    transform: toColorString,
  },

  // Severity tag - contrast
  {
    from: 'usages.badge.defaultVariant.contrast.background',
    to: 'components.badge.contrast.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.defaultVariant.contrast.color',
    to: 'components.badge.contrast.color',
    transform: toColorString,
  },
];
