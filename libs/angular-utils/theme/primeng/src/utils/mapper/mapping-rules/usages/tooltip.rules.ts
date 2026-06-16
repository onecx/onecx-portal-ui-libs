import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const tooltipMappingRules: MappingRule[] = [
  {
    from: 'usages.tooltip.maxWidth',
    to: 'components.tooltip.root.maxWidth',
  },
  {
    from: 'usages.tooltip.gutter',
    to: 'components.tooltip.root.gutter',
  },
  {
    from: 'usages.tooltip.shadow',
    to: 'components.tooltip.root.shadow',
  },
  {
    from: 'usages.tooltip.padding',
    to: 'components.tooltip.root.padding',
  },
  {
    from: 'usages.tooltip.border.radius',
    to: 'components.tooltip.root.borderRadius',
  },
  {
    from: 'usages.tooltip.background',
    to: 'components.tooltip.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.tooltip.color',
    to: 'components.tooltip.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
];
