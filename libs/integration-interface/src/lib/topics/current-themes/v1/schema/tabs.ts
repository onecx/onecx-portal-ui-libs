import * as z from "zod";
import { bg, border, borderWithShadow, color, font, icon, severityStyles, transition, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";
import { tooltip } from "./tooltip";

export const tabsSettings = z
  .object({
    unstyled: withRef(z.boolean()).default(false),
    lazy: withRef(z.boolean()).default(false),
    selectOnFocus: withRef(z.boolean()).default(false),
    showNavigators: withRef(z.boolean()).default(true),
    scrollStrategy: withRef(z.union([z.enum(['nearest', 'center']), z.literal(false)])).default('nearest'),
  })
  .register(themeSchemaRegistry, { id: 'tabsSettings' })

const DEFAULT_TABS_BORDER = border.default({
  color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
  radius: "{{primitives.border.radius.sm}}",
  width: "{{primitives.border.width.sm}}",
  style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
  offset: "{{primitives.border.offset.none}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultBorder" });

const DEFAULT_TABS_FONT = font.default({
  family: "{{primitives.font.family}}",
  weight: "{{primitives.font.weight}}",
  size: "{{primitives.font.size}}",
  lineHeight: "{{primitives.font.lineHeight}}",
  letterSpacing: "{{primitives.font.letterSpacing}}",
  style: "{{primitives.font.style}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultFont" });

const DEFAULT_TABS_BACKGROUND = bg.default({
  color: "{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultBackground" });

const DEFAULT_TABS_FOCUS_RING = borderWithShadow.default({
  color: "{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}",
  width: "{{primitives.focusRing.width.sm}}",
  style: "{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}",
  offset: "{{primitives.focusRing.offset.none}}",
  shadow: "{{primitives.focusRing.shadow.none}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultFocusRing" });

const DEFAULT_TABS_TRANSITION = transition.default({
  duration: "{{primitives.transition.duration}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultTransition" });

const DEFAULT_TABS_ICON = icon.default({
  color: "{{primitives.defaultVariant.defaultState.defaultSeverity.icon.color}}",
  size: "{{primitives.defaultVariant.defaultState.defaultSeverity.icon.size.sm}}",
}).register(themeSchemaRegistry, { id: "tabsDefaultIcon" });

const DEFAULT_TABS_STYLES = z.object({
  ...severityStyles.shape,
  bg: DEFAULT_TABS_BACKGROUND.prefault({}),
  border: DEFAULT_TABS_BORDER.prefault({}),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.defaultState.defaultSeverity.cursor}}"),
  contrast: withRef(color).default("{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}"),
  font: DEFAULT_TABS_FONT.prefault({}),
  icon: DEFAULT_TABS_ICON.prefault({}),
}).register(themeSchemaRegistry, { id: "tabsDefaultStyles" });

const TABS_HOVER_STYLES = DEFAULT_TABS_STYLES
.omit({
  contrast: true,
  font: true,
}).extend({
  border: DEFAULT_TABS_BORDER.prefault({
    width: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.width}}",
    style: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}",
    color: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}",
  }),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.hover.defaultSeverity.cursor}}"),
  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  bg: DEFAULT_TABS_BACKGROUND.prefault({
    color: "{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}",
  }),
  icon: DEFAULT_TABS_ICON.prefault({
    color: "{{primitives.defaultVariant.state.hover.defaultSeverity.icon.color}}",
  }),
}).register(themeSchemaRegistry, { id: "tabsHoverStyles" });

const TABS_FOCUS_STYLES = DEFAULT_TABS_STYLES
.omit({
  contrast: true,
  font: true,
}).extend({
  border: DEFAULT_TABS_BORDER.prefault({
    width: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.width}}",
    style: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}",
    color: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}",
  }),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.hover.defaultSeverity.cursor}}"),
  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  bg: DEFAULT_TABS_BACKGROUND.prefault({
    color: "{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}",
  }),
  icon: DEFAULT_TABS_ICON.prefault({
    color: "{{primitives.defaultVariant.state.hover.defaultSeverity.icon.color}}",
  }),
}).register(themeSchemaRegistry, { id: "tabsFocusStyles" });

const TABS_ACTIVE_STYLES = DEFAULT_TABS_STYLES
.omit({
  contrast: true,
  font: true,
}).extend({
  border: DEFAULT_TABS_BORDER.prefault({
    width: "{{primitives.defaultVariant.state.active.defaultSeverity.border.width}}",
    style: "{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}",
    color: "{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}",
  }),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.active.defaultSeverity.cursor}}"),
  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  bg: DEFAULT_TABS_BACKGROUND.prefault({
    color: "{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}",
  }),
  icon: DEFAULT_TABS_ICON.prefault({
    color: "{{primitives.defaultVariant.state.active.defaultSeverity.icon.color}}",
  }),
}).register(themeSchemaRegistry, { id: "tabsActiveStyles" });

const TABS_DISABLED_STYLES = DEFAULT_TABS_STYLES
.pick({
  border: true,
  cursor: true,
  contrast: true,
}).extend({
  border: DEFAULT_TABS_BORDER.prefault({
    color: "{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}",
  }),
  cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.disabled.defaultSeverity.cursor}}"),
  contrast: withRef(color).default("{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}"),
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

export const tabsTabList = z.object({
    bg: DEFAULT_TABS_BACKGROUND.prefault({}),
    padding: withRef(z.string()).default("{{primitives.layout.padding}}"),
    gap: withRef(z.string()).default("{{primitives.layout.gap}}"),
  contentFlexGrow: withRef(z.string()).default("1"),
    leftNavButton: (tabsNavButton as typeof tabsNavButton).prefault({}),
    rightNavButton: (tabsNavButton as typeof tabsNavButton).prefault({}),
    content: DEFAULT_TABS_STYLES.omit({
      border: true,
      cursor: true,
      icon: true,
    }).prefault({}),
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

export const tabsActiveBar = z.object({
    size: withRef(z.string()).default("2.5rem"),
    bottom: withRef(z.string()).default("0"),
    transition: DEFAULT_TABS_TRANSITION.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsActiveBar" });

export const tabsTabDefaultSeverity = z.object({
  padding: withRef(z.string()).default("{{primitives.layout.padding}}"),
  margin: withRef(z.string()).default("{{primitives.layout.margin}}"),
  gap: withRef(z.string()).default("{{primitives.layout.gap}}"),
  userSelect: withRef(z.string()).default("none"),
  whiteSpace: withRef(z.string()).default("nowrap"),
  scrollableFlexGrow: withRef(z.string()).default("0"),
  icon: DEFAULT_TABS_ICON.prefault({}),
  alignItems: withRef(z.string()).default("{{primitives.layout.alignItems}}"),
  justifyContent: withRef(z.string()).default("{{primitives.layout.justifyContent}}"),
  activeBar: (tabsActiveBar as typeof tabsActiveBar).prefault({}),
  tooltip: tooltip.prefault({}),
}).register(themeSchemaRegistry, { id: "tabsTabDefaultSeverity" });

export const tabsTab = DEFAULT_TABS_STYLES
  .extend({
    ...tabsTabDefaultSeverity.shape,
    hover: TABS_HOVER_STYLES.prefault({}),
    focus: TABS_FOCUS_STYLES.prefault({}),
    active: TABS_ACTIVE_STYLES.prefault({}),
    disabled: TABS_DISABLED_STYLES.prefault({}),
  })
  .register(themeSchemaRegistry, { id: "tabsTab" });

export const tabsTabPanel = DEFAULT_TABS_STYLES.pick({
    bg: true,
    contrast: true,
    font: true,
  })
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
    focusRing: DEFAULT_TABS_FOCUS_RING.prefault({}),
    shadow: withRef(z.string()).default("{{primitives.shadow.none}}"),
  })
  .register(themeSchemaRegistry, { id: 'tabs' })
