import * as z from "zod";
import { bg, border, borderWithShadow, color, focusRing, font, icon, severityStyles, shadow, shadow, transition, withRef } from "./primitives";
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

const DEFAULT_TABS_STYLES = severityStyles.extend({
  border: DEFAULT_TABS_BORDER.prefault({}),
  cursor: "{{primitives.defaultVariant.defaultState.defaultSeverity.cursor}}",
  bg: "{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}",
  contrast: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
  font: DEFAULT_TABS_FONT.prefault({}),
  focusRing: DEFAULT_TABS_FOCUS_RING.prefault({}),
  shadow: "{{primitives.shadow.sm}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultStyles" });

//use p-button usage instead when it is released
export const tabsNavButton = DEFAULT_TABS_STYLES.extend({
    hover: DEFAULT_TABS_STYLES.extend({
      border: "{{primitives.defaultVariant.hoverState.defaultSeverity.border}}",
      bg: "{{primitives.defaultVariant.hoverState.defaultSeverity.bg}}",
      contrast: "{{primitives.defaultVariant.hoverState.defaultSeverity.contrast}}",
    }).prefault({}),
    focus: DEFAULT_TABS_STYLES.prefault({}),
    disabled: DEFAULT_TABS_STYLES.prefault({}),
    width: withRef(z.string()).default("2.5rem"),
    height: withRef(z.string()).default("100%"),
    tooltip: tooltip.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsNavButton" });

export const tabsTabList = tabsBaseStyles.extend({
    padding: withRef(z.string()).default("0"),
    gap: withRef(z.string()).default("0"),
    leftNavButton: (tabsNavButton as typeof tabsNavButton).prefault({}),
    rightNavButton: (tabsNavButton as typeof tabsNavButton).prefault({}),
    content: tabsBaseStyles.prefault({}),
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

export const tabsActiveBar = tabsSeverityWithCursor
  .extend({
    size: withRef(z.string()).default("2.5rem"),
    bottom: withRef(z.string()).default("0"),
    transition: withRef(z.string()).default(DEFAULT_TABS_TRANSITION.duration),
  })
  .register(themeSchemaRegistry, { id: "tabsActiveBar" });

export const tabsTabDefaultSeverity = tabsSeverityWithCursor.extend({
  padding: withRef(z.string()).default("{{primitives.space.md}}"),
  margin: withRef(z.string()).default("0"),
  gap: withRef(z.string()).default("{{primitives.space.sm}}"),
  icon: icon.prefault({}),
  alignItems: withRef(z.string()).default("center"),
  justifyContent: withRef(z.string()).default("center"),
  activeBar: (tabsActiveBar as typeof tabsActiveBar).prefault({}),
  tooltip: tooltip.prefault({}),
}).register(themeSchemaRegistry, { id: "tabsTabDefaultSeverity" });

export const tabsTab = tabsTabDefaultSeverity
  .extend({
    hover: tabsTabDefaultSeverity.prefault({}),
    focus: tabsTabDefaultSeverity.prefault({}),
    active: tabsTabDefaultSeverity.prefault({}),
    disabled: tabsTabDefaultSeverity.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsTab" });

export const tabsTabPanel = tabsBaseStyles
  .extend({
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
    alignItems: withRef(z.string()).default("flex-start"),
    justifyContent: withRef(z.string()).default("flex-start"),
  })
  .register(themeSchemaRegistry, { id: "tabsTabPanel" });

export const tabs = tabsSeverityWithTransition.extend({
    settings: (tabsSettings as typeof tabsSettings).prefault({}),
    tablist: (tabsTabList as typeof tabsTabList).prefault({}),
    viewport: (tabsViewport as typeof tabsViewport).prefault({}),
    tab: (tabsTab as typeof tabsTab).prefault({}),
    tabpanel: (tabsTabPanel as typeof tabsTabPanel).prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabs" });