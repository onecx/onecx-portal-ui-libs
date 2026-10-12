import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

type CanonicalSeverity = 'info' | 'success' | 'warning' | 'danger' | 'contrast' | 'secondary'

// Our canonical severity names differ from PrimeNG's own colorScheme keys for two of them
// (warning -> warn, danger -> error); the rest match 1:1.
const PRIME_SEVERITY: Record<CanonicalSeverity, 'info' | 'success' | 'warn' | 'error' | 'contrast' | 'secondary'> = {
  info: 'info',
  success: 'success',
  warning: 'warn',
  danger: 'error',
  contrast: 'contrast',
  secondary: 'secondary',
}

const root: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultSeverity.border.radius',
    to: 'components.message.root.borderRadius',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.border.width',
    to: 'components.message.root.borderWidth',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.transition.duration',
    to: 'components.message.root.transitionDuration',
  },
]

const content: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultSeverity.content.padding',
    to: 'components.message.content.padding',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.content.gap',
    to: 'components.message.content.gap',
  },
  {
    from: 'usages.message.sm.content.padding',
    to: 'components.message.content.sm.padding',
  },
  {
    from: 'usages.message.lg.content.padding',
    to: 'components.message.content.lg.padding',
  },
]

const text: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultSeverity.text.font.size',
    to: 'components.message.text.fontSize',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.text.font.weight',
    to: 'components.message.text.fontWeight',
  },
  {
    from: 'usages.message.sm.text.font.size',
    to: 'components.message.text.sm.fontSize',
  },
  {
    from: 'usages.message.lg.text.font.size',
    to: 'components.message.text.lg.fontSize',
  },
]

const icon: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultSeverity.icon.size',
    to: 'components.message.icon.size',
  },
  {
    from: 'usages.message.sm.icon.size',
    to: 'components.message.icon.sm.size',
  },
  {
    from: 'usages.message.lg.icon.size',
    to: 'components.message.icon.lg.size',
  },
]

const closeButtonStructural: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultSeverity.closeButton.width',
    to: 'components.message.closeButton.width',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.closeButton.height',
    to: 'components.message.closeButton.height',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.closeButton.border.radius',
    to: 'components.message.closeButton.borderRadius',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.closeButton.focusRing.width',
    to: 'components.message.closeButton.focusRing.width',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.closeButton.focusRing.style',
    to: 'components.message.closeButton.focusRing.style',
  },
  {
    from: 'usages.message.defaultVariant.defaultSeverity.closeButton.focusRing.offset',
    to: 'components.message.closeButton.focusRing.offset',
  },
]

const closeIcon: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultSeverity.closeIcon.size',
    to: 'components.message.closeIcon.size',
  },
  {
    from: 'usages.message.sm.closeIcon.size',
    to: 'components.message.closeIcon.sm.size',
  },
  {
    from: 'usages.message.lg.closeIcon.size',
    to: 'components.message.closeIcon.lg.size',
  },
]

const outlinedRoot: MappingRule[] = [
  {
    from: 'usages.message.outlined.defaultSeverity.border.width',
    to: 'components.message.outlined.root.borderWidth',
  },
]

const simpleRoot: MappingRule[] = [
  {
    from: 'usages.message.simple.defaultSeverity.content.padding',
    to: 'components.message.simple.content.padding',
  },
]

function defaultVariantRules(severity: CanonicalSeverity): MappingRule[] {
  const prime = PRIME_SEVERITY[severity]
  return [
    {
      from: `usages.message.defaultVariant.${severity}.background`,
      to: `components.message.colorScheme.{mode}.${prime}.background`,
      transform: toColorString,
    },
    {
      from: `usages.message.defaultVariant.${severity}.border.color`,
      to: `components.message.colorScheme.{mode}.${prime}.borderColor`,
      transform: toColorString,
    },
    {
      from: `usages.message.defaultVariant.${severity}.color`,
      to: `components.message.colorScheme.{mode}.${prime}.color`,
      transform: toColorString,
    },
    {
      from: `usages.message.defaultVariant.${severity}.shadow`,
      to: `components.message.colorScheme.{mode}.${prime}.shadow`,
    },
    {
      from: `usages.message.defaultVariant.${severity}.closeButton.hover.background`,
      to: `components.message.colorScheme.{mode}.${prime}.closeButton.hoverBackground`,
      transform: toColorString,
    },
    {
      from: `usages.message.defaultVariant.${severity}.closeButton.focus.color`,
      to: `components.message.colorScheme.{mode}.${prime}.closeButton.focusRing.color`,
      transform: toColorString,
    },
    {
      from: `usages.message.defaultVariant.${severity}.closeButton.focus.shadow`,
      to: `components.message.colorScheme.{mode}.${prime}.closeButton.focusRing.shadow`,
    },
  ]
}

function outlinedSeverityRules(severity: CanonicalSeverity): MappingRule[] {
  const prime = PRIME_SEVERITY[severity]
  return [
    {
      from: `usages.message.outlined.${severity}.color`,
      to: `components.message.colorScheme.{mode}.${prime}.outlined.color`,
      transform: toColorString,
    },
    {
      from: `usages.message.outlined.${severity}.border.color`,
      to: `components.message.colorScheme.{mode}.${prime}.outlined.borderColor`,
      transform: toColorString,
    },
  ]
}

function simpleSeverityRules(severity: CanonicalSeverity): MappingRule[] {
  const prime = PRIME_SEVERITY[severity]
  return [
    {
      from: `usages.message.simple.${severity}.color`,
      to: `components.message.colorScheme.{mode}.${prime}.simple.color`,
      transform: toColorString,
    },
  ]
}

const defaultVariant: MappingRule[] = [
  ...defaultVariantRules('info'),
  ...defaultVariantRules('success'),
  ...defaultVariantRules('warning'),
  ...defaultVariantRules('danger'),
  ...defaultVariantRules('contrast'),
  ...defaultVariantRules('secondary'),
]

const outlined: MappingRule[] = [
  ...outlinedRoot,
  ...outlinedSeverityRules('info'),
  ...outlinedSeverityRules('success'),
  ...outlinedSeverityRules('warning'),
  ...outlinedSeverityRules('danger'),
  ...outlinedSeverityRules('contrast'),
  ...outlinedSeverityRules('secondary'),
]

const simple: MappingRule[] = [
  ...simpleRoot,
  ...simpleSeverityRules('info'),
  ...simpleSeverityRules('success'),
  ...simpleSeverityRules('warning'),
  ...simpleSeverityRules('danger'),
  ...simpleSeverityRules('contrast'),
  ...simpleSeverityRules('secondary'),
]

export const messageMappingRules: MappingRule[] = [
  ...root,
  ...content,
  ...text,
  ...icon,
  ...closeButtonStructural,
  ...closeIcon,
  ...defaultVariant,
  ...outlined,
  ...simple,
]
