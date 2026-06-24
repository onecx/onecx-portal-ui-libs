import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const dialogMappingRules: MappingRule[] = [
  {
    from: 'usages.dialog.root.bg',
    to: 'components.dialog.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.dialog.root.border.color',
    to: 'components.dialog.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dialog.root.contrast',
    to: 'components.dialog.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.dialog.root.radius',
    to: 'components.dialog.root.borderRadius',
  },
  {
    from: 'usages.dialog.root.shadow',
    to: 'components.dialog.root.shadow',
  },
  {
    from: 'usages.dialog.header.padding',
    to: 'components.dialog.header.padding',
  },
  {
    from: 'usages.dialog.header.gap',
    to: 'components.dialog.header.gap',
  },
  {
    from: 'usages.dialog.title.fontSize',
    to: 'components.dialog.title.fontSize',
  },
  {
    from: 'usages.dialog.title.fontWeight',
    to: 'components.dialog.title.fontWeight',
  },
  {
    from: 'usages.dialog.content.padding',
    to: 'components.dialog.content.padding',
  },
  {
    from: 'usages.dialog.footer.padding',
    to: 'components.dialog.footer.padding',
  },
  {
    from: 'usages.dialog.footer.gap',
    to: 'components.dialog.footer.gap',
  },
];