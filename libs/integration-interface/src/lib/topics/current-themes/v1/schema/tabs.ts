import * as z from "zod";
import { bg, borderWithShadow, color, font, icon, withRef } from "./primitives";
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

const DEFAULT_TABS_BACKGROUND = {
  color: "{{primitives.area.surface.defaultState.defaultVariant.bg}}",
};

const DEFAULT_TABS_COLOR = "{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}";

const DEFAULT_TABS_BORDER = {
  color: "{{primitives.border.defaultVariant.color}}",
  radius: "{{primitives.radius.md}}",
  width: "1px",
};

const DEFAULT_TABS_FONT = {
  weight: "{{primitives.font.weight}}",
  size: "{{primitives.font.size}}",
};

const DEFAULT_TABS_FOCUS_RING = {
  color: "{{primitives.focusRing.color}}",
  width: "{{primitives.focusRing.width}}",
  style: "{{primitives.focusRing.style}}",
  offset: "{{primitives.focusRing.offset}}",
  shadow: "{{primitives.focusRing.shadow}}",
};

const DEFAULT_TABS_TRANSITION = {
  duration: "{{primitives.transition.duration}}",
};

export const tabsSeverityBaseStyles = z.object({
  background: bg.default(DEFAULT_TABS_BACKGROUND),
  color: color.default(DEFAULT_TABS_COLOR),
  border: borderWithShadow.default(DEFAULT_TABS_BORDER),
  font: font.default(DEFAULT_TABS_FONT),
  focusRing: borderWithShadow.default(DEFAULT_TABS_FOCUS_RING),
  shadow: withRef(z.string()).default("{{primitives.shadow.none}}"),
}).register(themeSchemaRegistry, { id: "tabsSeverityBaseStyles" });

export const tabsSeverityWithCursor = tabsSeverityBaseStyles.extend({
  cursor: withRef(z.string()).default("pointer"),
}).register(themeSchemaRegistry, { id: "tabsSeverityWithCursor" });

export const tabsSeverityWithTransition = tabsSeverityBaseStyles.extend({
  transition: withRef(z.string()).default(DEFAULT_TABS_TRANSITION.duration),
}).register(themeSchemaRegistry, { id: "tabsSeverityWithTransition" });

//use p-button usage instead when it is released
export const tabsNavButton = tabsSeverityWithCursor.extend({
    hover: tabsSeverityWithCursor.prefault({}),
    focus: tabsSeverityWithCursor.prefault({}),
    disabled: tabsSeverityWithCursor.prefault({}),
    width: withRef(z.string()).default("2.5rem"),
    height: withRef(z.string()).default("100%"),
    tooltip: tooltip.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsNavButton" });

export const tabsTabList = tabsSeverityBaseStyles.extend({
    padding: withRef(z.string()).default("0"),
    gap: withRef(z.string()).default("0"),
    navButtons: (tabsNavButton as typeof tabsNavButton).prefault({}),
    content: tabsSeverityBaseStyles.prefault({}),
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

export const tabsTabPanel = tabsSeverityBaseStyles
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