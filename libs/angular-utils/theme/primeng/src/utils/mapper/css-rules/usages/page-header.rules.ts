import type { CssRule } from '../../mapper.types'

export const pageHeaderCssRules: CssRule[] = [
  {
    selector: '.onecx-page-header',
    declarations: [
      { property: 'background-color', from: 'usages.pageHeader.background.color' },
      { property: 'border-color', from: 'usages.pageHeader.border.color' },
      { property: 'border-width', from: 'usages.pageHeader.border.width' },
      { property: 'border-radius', from: 'usages.pageHeader.border.radius' },
      { property: 'box-shadow', from: 'usages.pageHeader.shadow' },
      { property: 'padding', from: 'usages.pageHeader.padding' },
      { property: 'margin', from: 'usages.pageHeader.margin' },
    ],
  },
  {
    selector: '.onecx-page-header .title-bar',
    declarations: [
      { property: 'color', from: 'usages.pageHeader.header.color' },
      { property: 'background-color', from: 'usages.pageHeader.header.background.color' },
      { property: 'padding', from: 'usages.pageHeader.header.padding' },
      { property: 'gap', from: 'usages.pageHeader.header.gap' },
    ],
  },
  {
    selector: '.onecx-page-header .title-wrap',
    declarations: [{ property: 'align-items', from: 'usages.pageHeader.header.titleWrap.alignItems' }],
  },
  {
    selector: '.onecx-page-header #page-header',
    declarations: [
      { property: 'font-family', from: 'usages.pageHeader.header.title.font.family' },
      { property: 'font-size', from: 'usages.pageHeader.header.title.font.size' },
      { property: 'font-weight', from: 'usages.pageHeader.header.title.font.weight' },
      { property: 'padding', from: 'usages.pageHeader.header.title.padding' },
    ],
  },
  {
    selector: '.onecx-page-header #page-subheader',
    declarations: [
      { property: 'font-family', from: 'usages.pageHeader.header.subtitle.font.family' },
      { property: 'font-size', from: 'usages.pageHeader.header.subtitle.font.size' },
      { property: 'font-weight', from: 'usages.pageHeader.header.subtitle.font.weight' },
      { property: 'padding', from: 'usages.pageHeader.header.subtitle.padding' },
    ],
  },
  {
    selector: '.onecx-page-header .figure .colorblob',
    declarations: [{ property: 'background-color', from: 'usages.pageHeader.header.titleIcon.background.color' }],
  },
  {
    selector: '.onecx-page-header .figure .figure-image img',
    declarations: [
      { property: 'width', from: 'usages.pageHeader.header.titleIcon.image.width' },
      { property: 'height', from: 'usages.pageHeader.header.titleIcon.image.height' },
    ],
  },
  {
    selector: '.onecx-page-header .action-items-wrap',
    declarations: [
      { property: 'padding', from: 'usages.pageHeader.header.actionPanel.padding' },
      { property: 'gap', from: 'usages.pageHeader.header.actionPanel.gap' },
    ],
  },
  {
    selector: '.onecx-page-header .object-panel',
    declarations: [
      { property: 'color', from: 'usages.pageHeader.content.color' },
      { property: 'background-color', from: 'usages.pageHeader.content.background.color' },
      { property: 'border-top-color', from: 'usages.pageHeader.content.borderTop.color' },
      { property: 'border-top-width', from: 'usages.pageHeader.content.borderTop.width' },
      { property: 'padding', from: 'usages.pageHeader.content.padding' },
      { property: 'font-family', from: 'usages.pageHeader.content.font.family' },
      { property: 'font-size', from: 'usages.pageHeader.content.font.size' },
      { property: 'font-weight', from: 'usages.pageHeader.content.font.weight' },
    ],
  },
  {
    selector: '.onecx-page-header .object-detail-label',
    declarations: [
      { property: 'color', from: 'usages.pageHeader.content.label.color' },
      { property: 'padding', from: 'usages.pageHeader.content.label.padding' },
      { property: 'gap', from: 'usages.pageHeader.content.label.gap' },
      { property: 'font-family', from: 'usages.pageHeader.content.label.font.family' },
      { property: 'font-size', from: 'usages.pageHeader.content.label.font.size' },
      { property: 'font-weight', from: 'usages.pageHeader.content.label.font.weight' },
    ],
  },
  {
    selector: '.onecx-page-header .object-detail-value',
    declarations: [
      { property: 'color', from: 'usages.pageHeader.content.value.color' },
      { property: 'padding', from: 'usages.pageHeader.content.value.padding' },
      { property: 'font-family', from: 'usages.pageHeader.content.value.font.family' },
      { property: 'font-size', from: 'usages.pageHeader.content.value.font.size' },
      { property: 'font-weight', from: 'usages.pageHeader.content.value.font.weight' },
    ],
  },
  {
    selector: '.onecx-page-header .object-info-grid-value .object-detail-icon',
    declarations: [{ property: 'color', from: 'usages.pageHeader.content.value.color' }],
  },
  {
    selector: '.onecx-page-header .object-detail-label',
    declarations: [
      { property: 'color', from: 'usages.pageHeader.content.label.color' },
      { property: 'padding', from: 'usages.pageHeader.content.label.padding' },
      { property: 'gap', from: 'usages.pageHeader.content.label.gap' },
      { property: 'font-family', from: 'usages.pageHeader.content.label.font.family' },
      { property: 'font-size', from: 'usages.pageHeader.content.label.font.size' },
      { property: 'font-weight', from: 'usages.pageHeader.content.label.font.weight' },
    ],
  },
  {
    selector: '.onecx-page-header .object-detail-value',
    declarations: [
      { property: 'color', from: 'usages.pageHeader.content.value.color' },
      { property: 'padding', from: 'usages.pageHeader.content.value.padding' },
      { property: 'font-family', from: 'usages.pageHeader.content.value.font.family' },
      { property: 'font-size', from: 'usages.pageHeader.content.value.font.size' },
      { property: 'font-weight', from: 'usages.pageHeader.content.value.font.weight' },
    ],
  },
  {
    selector: '.onecx-page-header .object-detail-value .object-detail-icon',
    declarations: [{ property: 'color', from: 'usages.pageHeader.content.value.color' }],
  },
]
