import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const SEARCH_HEADER_BREADCRUMB: MappingRule[] = [
  {
    from: 'usages.searchHeader.breadCrumbs.bg',
    to: 'components.breadcrumb.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.breadCrumbs.transition.duration',
    to: 'components.breadcrumb.root.transitionDuration',
  },
  {
    from: 'usages.searchHeader.breadCrumbs.breadcrumbItem.color',
    to: 'components.breadcrumb.item.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.breadCrumbs.breadcrumbItem.border.radius',
    to: 'components.breadcrumb.item.borderRadius',
  },
  {
    from: 'usages.searchHeader.breadCrumbs.breadcrumbItemStates.state.hover.defaultVariant.contrast',
    to: 'components.breadcrumb.item.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.breadCrumbs.focusRing.width',
    to: 'components.breadcrumb.item.focusRing.width',
  },
  {
    from: 'usages.searchHeader.breadCrumbs.focusRing.style',
    to: 'components.breadcrumb.item.focusRing.style',
  },
  {
    from: 'usages.searchHeader.breadCrumbs.focusRing.color',
    to: 'components.breadcrumb.item.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.breadCrumbs.focusRing.offset',
    to: 'components.breadcrumb.item.focusRing.offset',
  },
  {
    from: 'usages.searchHeader.breadCrumbs.focusRing.shadow',
    to: 'components.breadcrumb.item.focusRing.shadow',
  },
  {
    from: 'usages.searchHeader.breadCrumbs.icon.color',
    to: 'components.breadcrumb.item.icon.color',
    transform: toColorString,
  },
]

const SEARCH_HEADER_HEADER_ACTION_BUTTON: MappingRule[] = [
  {
    from: 'usages.searchHeader.headerActions.button.color',
    to: 'components.button.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.button.bg',
    to: 'components.button.primary.background',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.button.font.weight',
    to: 'components.button.root.label.fontWeight',
  },
  {
    from: 'usages.searchHeader.headerActions.button.font.size',
    to: 'components.button.root.lg.fontSize',
  },
  {
    from: 'usages.searchHeader.headerActions.button.border.radius',
    to: 'components.button.root.borderRadius',
  },
  {
    from: 'usages.searchHeader.headerActions.button.border.color',
    to: 'components.button.primary.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.buttonStates.state.hover.defaultVariant.bg',
    to: 'components.button.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.buttonStates.state.hover.defaultVariant.contrast',
    to: 'components.button.primary.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.buttonStates.state.active.defaultVariant.bg',
    to: 'components.button.primary.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.buttonStates.state.active.defaultVariant.contrast',
    to: 'components.button.primary.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.buttonStates.state.focus.defaultVariant.focusRing.color',
    to: 'components.button.primary.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.buttonStates.state.focus.defaultVariant.focusRing.shadow',
    to: 'components.button.primary.focusRing.shadow',
  },
]

const SEARCH_HEADER_CONTENT: MappingRule[] = [
  {
    from: 'usages.searchHeader.content.panel.bg',
    to: 'semantic.extend.onecx.searchHeader.content.background',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.content.panel.contrast',
    to: 'semantic.extend.onecx.searchHeader.content.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.content.spacing.padding',
    to: 'semantic.extend.onecx.searchHeader.content.padding',
  },
  {
    from: 'usages.searchHeader.content.spacing.gap',
    to: 'semantic.extend.onecx.searchHeader.content.gap',
  },
  {
    from: 'usages.searchHeader.content.input.label.size',
    to: 'semantic.extend.onecx.searchHeader.input.label.fontSize',
  },
  {
    from: 'usages.searchHeader.content.input.label.weight',
    to: 'semantic.extend.onecx.searchHeader.input.label.fontWeight',
  },
  {
    from: 'usages.searchHeader.content.input.value.size',
    to: 'semantic.extend.onecx.searchHeader.input.value.fontSize',
  },
  {
    from: 'usages.searchHeader.content.input.value.weight',
    to: 'semantic.extend.onecx.searchHeader.input.value.fontWeight',
  },
  {
    from: 'usages.searchHeader.content.input.placeholder.size',
    to: 'semantic.extend.onecx.searchHeader.input.placeholder.fontSize',
  },
]

const SEARCH_HEADER_FOOTER_ACTIONS: MappingRule[] = [
  {
    from: 'usages.searchHeader.footerActions.searchButton.button.bg',
    to: 'semantic.extend.onecx.searchHeader.footer.searchButton.background',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.footerActions.searchButton.button.color',
    to: 'semantic.extend.onecx.searchHeader.footer.searchButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.footerActions.searchButton.button.font.weight',
    to: 'semantic.extend.onecx.searchHeader.footer.searchButton.fontWeight',
  },
  {
    from: 'usages.searchHeader.footerActions.searchButton.button.font.size',
    to: 'semantic.extend.onecx.searchHeader.footer.searchButton.fontSize',
  },
  {
    from: 'usages.searchHeader.footerActions.resetButton.button.bg',
    to: 'semantic.extend.onecx.searchHeader.footer.resetButton.background',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.footerActions.resetButton.button.color',
    to: 'semantic.extend.onecx.searchHeader.footer.resetButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.footerActions.resetButton.button.font.weight',
    to: 'semantic.extend.onecx.searchHeader.footer.resetButton.fontWeight',
  },
  {
    from: 'usages.searchHeader.footerActions.resetButton.button.font.size',
    to: 'semantic.extend.onecx.searchHeader.footer.resetButton.fontSize',
  },
  {
    from: 'usages.searchHeader.footerActions.spacing.gap',
    to: 'semantic.extend.onecx.searchHeader.footer.gap',
  },
]

const SEARCH_HEADER_CUSTOM_SEMANTIC: MappingRule[] = [
  {
    from: 'usages.searchHeader.header.text.title.family',
    to: 'semantic.extend.onecx.searchHeader.title.fontFamily',
  },
  {
    from: 'usages.searchHeader.header.text.title.size',
    to: 'semantic.extend.onecx.searchHeader.title.fontSize',
  },
  {
    from: 'usages.searchHeader.header.text.title.weight',
    to: 'semantic.extend.onecx.searchHeader.title.fontWeight',
  },
  {
    from: 'usages.searchHeader.header.text.subtitle.family',
    to: 'semantic.extend.onecx.searchHeader.subtitle.fontFamily',
  },
  {
    from: 'usages.searchHeader.header.text.subtitle.size',
    to: 'semantic.extend.onecx.searchHeader.subtitle.fontSize',
  },
  {
    from: 'usages.searchHeader.header.text.title.color',
    to: 'semantic.extend.onecx.searchHeader.title.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.header.text.subtitle.color',
    to: 'semantic.extend.onecx.searchHeader.subtitle.color',
    transform: toColorString,
  },
  {
    from: 'usages.searchHeader.headerActions.alignment.horizontal',
    to: 'semantic.extend.onecx.searchHeader.headerActions.alignment.horizontal',
  },
  {
    from: 'usages.searchHeader.headerActions.alignment.vertical',
    to: 'semantic.extend.onecx.searchHeader.headerActions.alignment.vertical',
  },
  {
    from: 'usages.searchHeader.footerActions.alignment.horizontal',
    to: 'semantic.extend.onecx.searchHeader.footerActions.alignment.horizontal',
  },
  {
    from: 'usages.searchHeader.footerActions.alignment.vertical',
    to: 'semantic.extend.onecx.searchHeader.footerActions.alignment.vertical',
  },
]

export const searchHeaderMapping: MappingRule[] = [
  ...SEARCH_HEADER_BREADCRUMB,
  ...SEARCH_HEADER_HEADER_ACTION_BUTTON,
  ...SEARCH_HEADER_CONTENT,
  ...SEARCH_HEADER_FOOTER_ACTIONS,
  ...SEARCH_HEADER_CUSTOM_SEMANTIC,
]
