import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const tooltipMappingRules: MappingRule[] = [
  {
    from: 'usages.tooltip.defaultVariant.maxWidth',
    to: 'components.tooltip.root.maxWidth',
  },
  {
    from: 'usages.tooltip.defaultVariant.gutter',
    to: 'components.tooltip.root.gutter',
  },
  {
    from: 'usages.tooltip.defaultVariant.shadow',
    to: 'components.tooltip.root.shadow',
  },
  {
    from: 'usages.tooltip.defaultVariant.padding',
    to: 'components.tooltip.root.padding',
  },
  {
    from: 'usages.tooltip.defaultVariant.border.radius',
    to: 'components.tooltip.root.borderRadius',
  },
  {
    from: 'usages.tooltip.defaultVariant.background',
    to: 'components.tooltip.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.tooltip.defaultVariant.color',
    to: 'components.tooltip.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
];
