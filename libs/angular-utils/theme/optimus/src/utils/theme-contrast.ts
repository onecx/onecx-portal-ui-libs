import { contrastRatio, parseColor, toHex } from './focus-ring'

/**
 * Contrast guard for theme variables (WCAG 1.4.3 text 4.5:1, 1.4.11 non-text / icons 3:1).
 *
 * Theme variables are kebab-case in the theme DB and camelCase in the default variables; both are accepted.
 */
export const MIN_TEXT_CONTRAST = 4.5
export const MIN_ICON_CONTRAST = 3

export type ThemeContrastKind = 'text' | 'icon'

export interface ThemeColorPair {
  /** Human readable name used in warnings */
  name: string
  kind: ThemeContrastKind
  /** Foreground (text or icon) variable as `section.variable` */
  foreground: string
  /** Background variable as `section.variable` */
  background: string
  /** Variable of the surface below a translucent background, default `general.contentBgColor` */
  backdrop?: string
}

export interface ThemeContrastFinding {
  pair: ThemeColorPair
  foreground: string
  background: string
  ratio: number
  required: number
}

export type ThemeVariablesInput = Record<string, Record<string, string | null | undefined> | undefined>

/** Text/icon on background pairs that are rendered by the theme variables. */
export const THEME_COLOR_PAIRS: ThemeColorPair[] = [
  { name: 'body text', kind: 'text', foreground: 'general.textColor', background: 'general.bodyBgColor' },
  { name: 'content text', kind: 'text', foreground: 'general.textColor', background: 'general.contentBgColor' },
  {
    name: 'secondary content text',
    kind: 'text',
    foreground: 'general.textSecondaryColor',
    background: 'general.contentBgColor',
  },
  {
    name: 'secondary body text',
    kind: 'text',
    foreground: 'general.textSecondaryColor',
    background: 'general.bodyBgColor',
  },
  {
    name: 'overlay text',
    kind: 'text',
    foreground: 'general.textColor',
    background: 'general.overlayContentBgColor',
  },
  {
    name: 'hovered content text',
    kind: 'text',
    foreground: 'general.textSecondaryColor',
    background: 'general.hoverBgColor',
  },
  {
    name: 'primary on content',
    kind: 'text',
    foreground: 'general.primaryColor',
    background: 'general.contentBgColor',
  },
  {
    name: 'button text',
    kind: 'text',
    foreground: 'general.solidSurfaceTextColor',
    background: 'general.primaryColor',
  },
  {
    name: 'button hover text',
    kind: 'text',
    foreground: 'general.solidSurfaceTextColor',
    background: 'general.buttonHoverBg',
  },
  {
    name: 'danger button text',
    kind: 'text',
    foreground: 'general.solidSurfaceTextColor',
    background: 'general.dangerButtonBg',
  },
  { name: 'info message', kind: 'text', foreground: 'general.textSecondaryColor', background: 'general.infoMessageBg' },
  {
    name: 'success message',
    kind: 'text',
    foreground: 'general.textSecondaryColor',
    background: 'general.successMessageBg',
  },
  {
    name: 'warning message',
    kind: 'text',
    foreground: 'general.textSecondaryColor',
    background: 'general.warningMessageBg',
  },
  {
    name: 'error message',
    kind: 'text',
    foreground: 'general.textSecondaryColor',
    background: 'general.errorMessageBg',
  },
  { name: 'top bar text', kind: 'text', foreground: 'topbar.topbarTextColor', background: 'topbar.topbarBgColor' },
  {
    name: 'top bar item text',
    kind: 'text',
    foreground: 'topbar.topbarItemTextColor',
    background: 'topbar.topbarBgColor',
  },
  {
    name: 'top bar left text',
    kind: 'text',
    foreground: 'topbar.topbarItemTextColor',
    background: 'topbar.topbarLeftBgColor',
  },
  {
    name: 'top bar item hover text',
    kind: 'text',
    foreground: 'topbar.topbarItemTextColor',
    background: 'topbar.topbarItemTextHoverBgColor',
  },
  // Top bar icons (language toggle, user menu, ...) are drawn in the item text colour
  { name: 'top bar icon', kind: 'icon', foreground: 'topbar.topbarItemTextColor', background: 'topbar.topbarBgColor' },
  {
    name: 'top bar icon on hover',
    kind: 'icon',
    foreground: 'topbar.topbarItemTextColor',
    background: 'topbar.topbarItemTextHoverBgColor',
  },
  { name: 'top bar logo', kind: 'icon', foreground: 'topbar.logoColor', background: 'topbar.topbarLeftBgColor' },
  {
    name: 'top bar menu button icon',
    kind: 'icon',
    foreground: 'topbar.topbarTextColor',
    background: 'topbar.topbarMenuButtonBgColor',
  },
  { name: 'menu text', kind: 'text', foreground: 'sidebar.menuTextColor', background: 'sidebar.menuBgColor' },
  { name: 'menu item text', kind: 'text', foreground: 'sidebar.menuItemTextColor', background: 'sidebar.menuBgColor' },
  {
    name: 'menu item hover text',
    kind: 'text',
    foreground: 'sidebar.menuItemTextColor',
    background: 'sidebar.menuItemHoverBgColor',
    backdrop: 'sidebar.menuBgColor',
  },
  {
    name: 'active menu item text',
    kind: 'text',
    foreground: 'sidebar.menuActiveItemTextColor',
    background: 'sidebar.menuActiveItemBgColor',
    backdrop: 'sidebar.menuBgColor',
  },
]

const toCamelCase = (str: string) => str.replace(/-([a-z])/g, (_m, letter: string) => letter.toUpperCase())

function lookup(variables: ThemeVariablesInput, path: string, defaults?: ThemeVariablesInput): string | undefined {
  const [section, name] = path.split('.')
  const find = (source: ThemeVariablesInput | undefined) => {
    if (!source) return undefined
    for (const [key, vars] of Object.entries(source)) {
      if (toCamelCase(key) !== section || !vars) continue
      for (const [varName, value] of Object.entries(vars)) {
        if (toCamelCase(varName) === name && typeof value === 'string' && value.trim()) return value
      }
    }
    return undefined
  }
  return find(variables) ?? find(defaults)
}

function alphaOf(color: string): number {
  const c = color.trim()
  const parseAlpha = (v: string) => (v.endsWith('%') ? parseFloat(v) / 100 : Number(v))
  const hex = /^#[0-9a-f]{6}([0-9a-f]{2})$/i.exec(c)
  if (hex) return parseInt(hex[1], 16) / 255
  const fn = /^rgba?\((.*)\)$/i.exec(c)
  if (!fn) return 1
  const parts = fn[1]
    .trim()
    .split(/[\s,/]+/)
    .filter(Boolean)
  const alpha = parts.length === 4 ? parseAlpha(parts[3]) : 1
  return Number.isNaN(alpha) ? 1 : Math.min(1, Math.max(0, alpha))
}

/** Blends a possibly translucent colour over an opaque backdrop, returns an opaque hex colour. */
function flatten(color: string, backdrop: string): string | undefined {
  const rgb = parseColor(color)
  if (!rgb) return undefined
  const alpha = alphaOf(color)
  const back = parseColor(backdrop)
  if (alpha >= 1 || !back) return toHex(rgb)
  return toHex(rgb.map((v, i) => v * alpha + back[i] * (1 - alpha)) as [number, number, number])
}

/**
 * Checks the colour pairs of the given theme variables. Variables that are not set in `variables` are taken from
 * `defaults` (the value actually applied), pairs for which a colour cannot be determined or parsed are skipped.
 */
export function checkThemeContrast(
  variables: ThemeVariablesInput | undefined,
  options: { pairs?: ThemeColorPair[]; defaults?: ThemeVariablesInput } = {}
): ThemeContrastFinding[] {
  const vars = variables ?? {}
  const findings: ThemeContrastFinding[] = []
  for (const pair of options.pairs ?? THEME_COLOR_PAIRS) {
    const fg = lookup(vars, pair.foreground, options.defaults)
    const bg = lookup(vars, pair.background, options.defaults)
    if (!fg || !bg) continue
    const backdrop = lookup(vars, pair.backdrop ?? 'general.contentBgColor', options.defaults) ?? '#ffffff'
    // an opaque backdrop for the background first, then the foreground on the resulting background
    const flatBackground = flatten(bg, flatten(backdrop, '#ffffff') ?? '#ffffff')
    const flatForeground = flatBackground && flatten(fg, flatBackground)
    if (!flatBackground || !flatForeground) continue
    const ratio = contrastRatio(flatForeground, flatBackground)
    const required = pair.kind === 'text' ? MIN_TEXT_CONTRAST : MIN_ICON_CONTRAST
    if (ratio < required) findings.push({ pair, foreground: fg, background: bg, ratio, required })
  }
  return findings
}

export function formatContrastFinding(finding: ThemeContrastFinding): string {
  return `${finding.pair.name} (${finding.pair.foreground} ${finding.foreground.trim()} on ${finding.pair.background} ${finding.background.trim()}): ${finding.ratio.toFixed(2)}:1, required ${finding.required}:1`
}

/**
 * Logs one warning listing all pairs below the WCAG thresholds. The theme is still applied (no silent change of the
 * colours of a theme owner), the warning only makes the problem visible. Returns the findings.
 */
export function warnOnLowThemeContrast(
  variables: ThemeVariablesInput | undefined,
  logger: { warn: (...args: any[]) => void },
  defaults?: ThemeVariablesInput
): ThemeContrastFinding[] {
  const findings = checkThemeContrast(variables, { defaults })
  if (findings.length > 0) {
    logger.warn(
      `Theme contrast below WCAG 2.2 AA (1.4.3 text 4.5:1, 1.4.11 icons 3:1), the theme is applied anyway:\n${findings
        .map(formatContrastFinding)
        .join('\n')}`
    )
  }
  return findings
}
