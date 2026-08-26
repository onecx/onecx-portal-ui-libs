import type { CssRule } from '../../mapper.types'

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.
//
// The PrimeNG DataView preset only exposes per-section borderColor/borderWidth/
// borderRadius/background/color/padding. The dataview schema additionally carries
// paddingX/paddingY/gap (split padding + inter-item gap) and, on the shared
// paginator, a focusRing and background that have no preset tokens — those are
// emitted here as CSS.

export const dataviewCssRules: CssRule[] = [
  // Root
  {
    selector: '.p-dataview',
    declarations: [
      { property: 'padding-inline', from: 'usages.dataview.paddingX' },
      { property: 'padding-block', from: 'usages.dataview.paddingY' },
      { property: 'gap', from: 'usages.dataview.gap' },
    ],
  },

  // Header
  {
    selector: '.p-dataview-header',
    declarations: [
      { property: 'padding-inline', from: 'usages.dataview.header.paddingX' },
      { property: 'padding-block', from: 'usages.dataview.header.paddingY' },
      { property: 'gap', from: 'usages.dataview.header.gap' },
    ],
  },

  // Content
  {
    selector: '.p-dataview-content',
    declarations: [
      { property: 'padding-inline', from: 'usages.dataview.content.paddingX' },
      { property: 'padding-block', from: 'usages.dataview.content.paddingY' },
      { property: 'gap', from: 'usages.dataview.content.gap' },
    ],
  },

  // Footer
  {
    selector: '.p-dataview-footer',
    declarations: [
      { property: 'padding-inline', from: 'usages.dataview.footer.paddingX' },
      { property: 'padding-block', from: 'usages.dataview.footer.paddingY' },
      { property: 'gap', from: 'usages.dataview.footer.gap' },
    ],
  },

  // Paginator (shared schema; top instance in the header, bottom in the footer)
  {
    selector: '.p-dataview-paginator-top',
    declarations: [
      { property: 'background', from: 'usages.dataview.header.paginator.background' },
      { property: 'color', from: 'usages.dataview.header.paginator.color' },
      {
        property: 'padding-inline',
        from: 'usages.dataview.header.paginator.paddingX',
      },
      {
        property: 'padding-block',
        from: 'usages.dataview.header.paginator.paddingY',
      },
      { property: 'gap', from: 'usages.dataview.header.paginator.gap' },
    ],
  },
  {
    selector: '.p-dataview-paginator-top :focus',
    declarations: [
      {
        property: 'outline-color',
        from: 'usages.dataview.header.paginator.focusRing.color',
      },
      {
        property: 'outline-width',
        from: 'usages.dataview.header.paginator.focusRing.width',
      },
      {
        property: 'outline-offset',
        from: 'usages.dataview.header.paginator.focusRing.offset',
      },
      {
        property: 'border-radius',
        from: 'usages.dataview.header.paginator.focusRing.radius',
      },
      {
        property: 'box-shadow',
        from: 'usages.dataview.header.paginator.focusRing.shadow',
      },
    ],
  },
  {
    selector: '.p-dataview-paginator-bottom',
    declarations: [
      { property: 'background', from: 'usages.dataview.footer.paginator.background' },
      { property: 'color', from: 'usages.dataview.footer.paginator.color' },
      {
        property: 'padding-inline',
        from: 'usages.dataview.footer.paginator.paddingX',
      },
      {
        property: 'padding-block',
        from: 'usages.dataview.footer.paginator.paddingY',
      },
      { property: 'gap', from: 'usages.dataview.footer.paginator.gap' },
    ],
  },
  {
    selector: '.p-dataview-paginator-bottom :focus',
    declarations: [
      {
        property: 'outline-color',
        from: 'usages.dataview.footer.paginator.focusRing.color',
      },
      {
        property: 'outline-width',
        from: 'usages.dataview.footer.paginator.focusRing.width',
      },
      {
        property: 'outline-offset',
        from: 'usages.dataview.footer.paginator.focusRing.offset',
      },
      {
        property: 'border-radius',
        from: 'usages.dataview.footer.paginator.focusRing.radius',
      },
      {
        property: 'box-shadow',
        from: 'usages.dataview.footer.paginator.focusRing.shadow',
      },
    ],
  },
]
