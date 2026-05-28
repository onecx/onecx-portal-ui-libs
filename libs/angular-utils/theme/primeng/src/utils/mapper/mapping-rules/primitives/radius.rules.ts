import type { MappingRule } from '../../mapper.types';

export const radiusRules: MappingRule[] = [
  {
    from: 'primitives.radius.none',
    to: 'semantic.borderRadius.none',
  },
  {
    from: 'primitives.radius.sm',
    to: 'semantic.borderRadius.sm',
  },
  {
    from: 'primitives.radius.md',
    to: 'semantic.borderRadius.md',
  },
  {
    from: 'primitives.radius.lg',
    to: 'semantic.borderRadius.lg',
  },
  {
    from: 'primitives.radius.xl',
    to: 'semantic.borderRadius.xl',
  },
];
