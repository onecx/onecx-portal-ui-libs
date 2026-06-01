/**
 * Represents a single source entry for a `@font-face` rule.
 * At least one of `url` or `local` should be provided.
 */
export interface FontSourceDefinition {
  /** Font file URL, rendered as `url("...")` in the CSS `src` descriptor. */
  url?: string
  /**
   * Format hint for the font file, rendered as `format("...")`.
   * Common values: `'woff2'`, `'woff'`, `'opentype'`, `'truetype'`, `'svg'`.
   */
  format?: string
  /** Local font name, rendered as `local("...")` in the CSS `src` descriptor. */
  local?: string
}

/**
 * Defines a custom font face to be injected as a `@font-face` CSS rule.
 * All properties map directly to the corresponding `@font-face` descriptors.
 * `fontFamily` and `src` are required for a valid `@font-face` rule.
 */
export interface FontDefinition {
  /** The name by which the font will be referenced in CSS `font-family` declarations. */
  fontFamily: string
  /**
   * The font resource(s). Accepts:
   * - A raw CSS `src` string (e.g. `"url('my-font.woff2') format('woff2')"`)
   * - A single {@link FontSourceDefinition} object
   * - An array of {@link FontSourceDefinition} objects for fallback chains
   */
  src: string | FontSourceDefinition | FontSourceDefinition[]
  /** Controls how the font is displayed while loading. Values: `'auto'`, `'block'`, `'swap'`, `'fallback'`, `'optional'`. */
  fontDisplay?: string
  /** Font stretch value, e.g. `'normal'`, `'condensed'`, or a range like `'50% 200%'`. */
  fontStretch?: string
  /** Font style value, e.g. `'normal'`, `'italic'`, or a range like `'oblique 20deg 50deg'`. */
  fontStyle?: string
  /** Font weight value, e.g. `'400'`, `'bold'`, or a range like `'100 900'`. */
  fontWeight?: string
  /** Controls advanced typographic features in OpenType fonts. */
  fontFeatureSettings?: string
  /** Low-level control over OpenType/TrueType font variation axes. */
  fontVariationSettings?: string
  /** The range of Unicode code points to be used from the font, e.g. `'U+0025-00FF'`. */
  unicodeRange?: string
  /** Defines the ascent metric override for the font. */
  ascentOverride?: string
  /** Defines the descent metric override for the font. */
  descentOverride?: string
  /** Defines the line gap metric override for the font. */
  lineGapOverride?: string
  /** Defines a multiplier for glyph outlines and metrics to harmonise font sizes. */
  sizeAdjust?: string
}
