import * as z from "zod";
import { bg, border, borderWithShadow, color, focusRing, font, icon, severityStyles, transition, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";
import { tooltip } from "./tooltip";

export const tabsSettings = z
  .object({
    unstyled: withRef(z.boolean()).default(false),
    lazy: withRef(z.boolean()).default(false),
    selectOnFocus: withRef(z.boolean()).default(false),
    showNavigators: withRef(z.boolean()).default(true),
    scrollStrategy: withRef(
      z.union([z.enum(["nearest", "center"]), z.literal(false)])
    ).default("nearest"),
  })
  .register(themeSchemaRegistry, { id: 'tabsSettings' })

const DEFAULT_TABS_BORDER = border.default({
  color: "{{primitives.border.color}}",
  radius: "{{primitives.border.radius}}",
  width: "{{primitives.border.width.sm}}",
  style: "{{primitives.border.style}}",
  offset: "{{primitives.border.offset}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultBorder" });

const DEFAULT_TABS_FONT = font.default({
  family: "{{primitives.font.family}}",
  weight: "{{primitives.font.weight}}",
  size: "{{primitives.font.size}}",
  lineHeight: "{{primitives.font.lineHeight}}",
  letterSpacing: "{{primitives.font.letterSpacing}}",
  style: "{{primitives.font.style}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultFont" });

const DEFAULT_TABS_FOCUS_RING = focusRing.default({
  color: "{{primitives.focusRing.color}}",
  width: "{{primitives.focusRing.width}}",
  style: "{{primitives.focusRing.style}}",
  offset: "{{primitives.focusRing.offset}}",
  shadow: "{{primitives.focusRing.shadow}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultFocusRing" });

const DEFAULT_TABS_TRANSITION = transition.default({
  duration: "{{primitives.transition.duration}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultTransition" });

const DEFAULT_TABS_ICON = icon.default({
  color: "{{primitives.defaultVariant.defaultState.defaultSeverity.icon.color}}",
  size: "20px",
}).register(themeSchemaRegistry, { id: "tabsDefaultIcon" });

const DEFAULT_TABS_STYLES = severityStyles.extend({
  border: DEFAULT_TABS_BORDER.prefault({}),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.defaultState.defaultSeverity.cursor}}"),
  contrast: withRef(color).default("{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}"),
  font: DEFAULT_TABS_FONT.prefault({}),
  focusRing: DEFAULT_TABS_FOCUS_RING.prefault({}),
  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  icon: DEFAULT_TABS_ICON.prefault({}),
}).register(themeSchemaRegistry, { id: "tabsDefaultStyles" });

const TABS_HOVER_STYLES = severityStyles.extend({
  border: DEFAULT_TABS_BORDER.prefault({}),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.hover.defaultSeverity.cursor}}"),
  contrast: withRef(color).default("{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}"),
  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  icon: DEFAULT_TABS_ICON.prefault({}),
}).register(themeSchemaRegistry, { id: "tabsHoverStyles" });

const TABS_FOCUS_STYLES = severityStyles.extend({
  border: DEFAULT_TABS_BORDER.prefault({}),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.focus.defaultSeverity.cursor}}"),
  contrast: withRef(color).default("{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}"),
  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  icon: DEFAULT_TABS_ICON.prefault({}),
}).register(themeSchemaRegistry, { id: "tabsFocusStyles" });

const TABS_DISABLED_STYLES = severityStyles.extend({
  border: DEFAULT_TABS_BORDER.prefault({}),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.disabled.defaultSeverity.cursor}}"),
  contrast: withRef(color).default("{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}"),
  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  icon: DEFAULT_TABS_ICON.prefault({}),
}).register(themeSchemaRegistry, { id: "tabsDisabledStyles" });

//use p-button usage instead when it is released
export const tabsNavButton = DEFAULT_TABS_STYLES.extend({
    hover: TABS_HOVER_STYLES.prefault({}),
    focus: TABS_FOCUS_STYLES.prefault({}),
    disabled: TABS_DISABLED_STYLES.prefault({}),
    width: withRef(z.string()).default("2.5rem"),
    height: withRef(z.string()).default("100%"),
    tooltip: tooltip.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsNavButton" });

export const tabsTabList = DEFAULT_TABS_STYLES.extend({
    padding: withRef(z.string()).default("{{primitives.layout.padding}}"),
    gap: withRef(z.string()).default("{{primitives.layout.gap}}"),
    leftNavButton: (tabsNavButton as typeof tabsNavButton).prefault({}),
    rightNavButton: (tabsNavButton as typeof tabsNavButton).prefault({}),
    content: DEFAULT_TABS_STYLES.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsTabList" });

export const tabsViewport = z
  .object({
    scrollBehavior: withRef(z.string()).default("smooth"),
    overscrollBehavior: withRef(z.string()).default("contain auto"),
    scrollbarWidth: withRef(z.string()).default("none"),
    webkitScrollbarDisplay: withRef(z.string()).default("none"),
  })
  .register(themeSchemaRegistry, { id: "tabsViewport" });

export const tabsActiveBar = DEFAULT_TABS_STYLES.extend({
    size: withRef(z.string()).default("2.5rem"),
    bottom: withRef(z.string()).default("0"),
    transition: DEFAULT_TABS_TRANSITION.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsActiveBar" });

export const tabsTabDefaultSeverity = z.object({
  padding: withRef(z.string()).default("{{primitives.layout.padding}}"),
  margin: withRef(z.string()).default("{{primitives.layout.margin}}"),
  gap: withRef(z.string()).default("{{primitives.layout.gap}}"),
  icon: DEFAULT_TABS_ICON.prefault({}),
  alignItems: withRef(z.string()).default("{{primitives.layout.alignItems}}"),
  justifyContent: withRef(z.string()).default("{{primitives.layout.justifyContent}}"),
  activeBar: (tabsActiveBar as typeof tabsActiveBar).prefault({}),
  tooltip: tooltip.prefault({}),
}).register(themeSchemaRegistry, { id: "tabsTabDefaultSeverity" });

const tabsTabBase = DEFAULT_TABS_STYLES.extend(tabsTabDefaultSeverity.shape);
const tabsTabHover = TABS_HOVER_STYLES.extend(tabsTabDefaultSeverity.shape);
const tabsTabFocus = TABS_FOCUS_STYLES.extend(tabsTabDefaultSeverity.shape);
const tabsTabDisabled = TABS_DISABLED_STYLES.extend(tabsTabDefaultSeverity.shape);

export const tabsTab = DEFAULT_TABS_STYLES
  .extend({
    ...tabsTabDefaultSeverity.shape,
    hover: tabsTabHover.prefault({}),
    focus: tabsTabFocus.prefault({}),
    active: tabsTabBase.prefault({}),
    disabled: tabsTabDisabled.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsTab" });

export const tabsTabPanel = DEFAULT_TABS_STYLES
  .extend({
    padding: withRef(z.string()).default("{{primitives.layout.padding}}"),
    gap: withRef(z.string()).default("{{primitives.layout.gap}}"),
    alignItems: withRef(z.string()).default("{{primitives.layout.alignItems}}"),
    justifyContent: withRef(z.string()).default("{{primitives.layout.justifyContent}}"),
  })
  .register(themeSchemaRegistry, { id: "tabsTabPanel" });

export const tabs = DEFAULT_TABS_STYLES.extend({
    settings: (tabsSettings as typeof tabsSettings).prefault({}),
    tablist: (tabsTabList as typeof tabsTabList).prefault({}),
    viewport: (tabsViewport as typeof tabsViewport).prefault({}),
    tab: (tabsTab as typeof tabsTab).prefault({}),
    tabpanel: (tabsTabPanel as typeof tabsTabPanel).prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabs" });