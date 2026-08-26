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
    from: 'usages.badge.border.radius',
    to: 'components.badge.root.borderRadius',
  },
  {
    from: 'usages.badge.font.size',
    to: 'components.badge.root.fontSize',
  },
  {
    from: 'usages.badge.font.weight',
    to: 'components.badge.root.fontWeight',
  },
  {
    from: 'usages.badge.padding',
    to: 'components.badge.root.padding',
  },
  {
    from: 'usages.badge.minWidth',
    to: 'components.badge.root.minWidth',
  },
  {
    from: 'usages.badge.height',
    to: 'components.badge.root.height',
  },

  // Named size variants
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

  // Color variant - primary
  {
    from: 'usages.badge.primary.background',
    to: 'components.badge.primary.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.primary.color',
    to: 'components.badge.primary.color',
    transform: toColorString,
  },

  // Color variant - secondary
  {
    from: 'usages.badge.secondary.background',
    to: 'components.badge.secondary.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.secondary.color',
    to: 'components.badge.secondary.color',
    transform: toColorString,
  },

  // Color variant - success
  {
    from: 'usages.badge.success.background',
    to: 'components.badge.success.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.success.color',
    to: 'components.badge.success.color',
    transform: toColorString,
  },

  // Color variant - info
  {
    from: 'usages.badge.info.background',
    to: 'components.badge.info.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.info.color',
    to: 'components.badge.info.color',
    transform: toColorString,
  },

  // Color variant - warning
  {
    from: 'usages.badge.warning.background',
    to: 'components.badge.warn.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.warning.color',
    to: 'components.badge.warn.color',
    transform: toColorString,
  },

  // Color variant - danger
  {
    from: 'usages.badge.danger.background',
    to: 'components.badge.danger.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.danger.color',
    to: 'components.badge.danger.color',
    transform: toColorString,
  },

  // Color variant - contrast
  {
    from: 'usages.badge.contrast.background',
    to: 'components.badge.contrast.background',
    transform: toColorString,
  },
  {
    from: 'usages.badge.contrast.color',
    to: 'components.badge.contrast.color',
    transform: toColorString,
  },
];
