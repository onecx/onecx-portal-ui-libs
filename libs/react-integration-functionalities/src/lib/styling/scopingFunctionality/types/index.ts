export type PrimeReactScoperOptions = {
  /**
   * UNIQUE id for this app (used only for diagnostics/attributes).
   * Example: 'product|test-app'
   */
  id: string;

  /**
   * UNIQUE PRODUCT_NAME for this application, its usually pure app name without postfix like ui/bff/svc.
   * Example: 'event-management'
   */
  productName: string;

  /**
   * CSS selector that matches the DOM element used as the "root" of this app.
   * All scoped rules will apply only under this root.
   * Example (light DOM): [data-style-id="product|test-app"]
   */
  scopeRootSelector: string;

  /**
   * Optional "donut" limit: the scope will not cross into elements matching this selector.
   * Default: [data-style-isolation]
   */
  scopeLimitSelector?: string;

  /**
   * Where to place the app's aggregate <style>. Default: document.head
   * You can pass any element that’s in the same document (e.g., a wrapper in light DOM).
   */
  target?: Element;

  /**
   * If true, process existing PR styles immediately (default true).
   * Set to false when you want "only future" updates (e.g., main app).
   */
  bootstrapExisting?: boolean;

  /**
   * Accept mutations only for N milliseconds after attach (default: Infinity).
   * Useful to capture only your own app's first burst, then ignore later global changes.
   */
  captureWindowMs?: number;

  /**
   * Disconnect observer after the first successful update (default: false).
   * Handy to "freeze" the app once it grabbed its own styles.
   */
  freezeAfterFirstUpdate?: boolean;

  /**
   * Mode to write into the app style tag:
   *  - 'replace-per-styleId' (default): keep one chunk per style-id, replace on content change.
   *  - 'append': append a new chunk on each content change (keeps history, grows).
   */
  mode?: 'replace-per-styleId' | 'append';

  /**
   * Optional: only include blocks containing this variable prefix, e.g., 'main' -> looks for '--main-'.
   * We still always include 'base', 'global', 'common'.
   */
  prefixFilter?: string;

  /**
   * Style-ids to always include regardless of prefix (default: base/global/common).
   */
  alwaysIncludeStyleIds?: string[];

  /**
   * Normalize CSS (strip comments + collapse whitespace) before hashing to avoid false positives.
   * Default: true
   */
  normalizeBeforeHash?: boolean;

  /**
   * NEW: If true, once a style-id has been captured for this app,
   * ignore all subsequent updates for that same id (per-style lock).
   * Default: false
   */
  blockFurtherUpdatesForCapturedIds?: boolean;

  /**
   * Controls the attribute name used for the style tag, e.g.:
   * <style data-["value"]-primereact-style="...">
   *
   * By default, "app" is used, resulting in:
   *   data-app-primereact-style
   *
   * Set to another string (e.g. "remote") to use:
   *   data-remote-primereact-style
   *
   * Example:
   *   dataPrimereactStyleName: "remote"
   */

  dataPrimereactStyleName?: string;

  /** Theme style identifier, e.g. `${PRODUCT_NAME}|${PRODUCT_NAME}-ui` */
  themeStyleId?: string;
  /** If true, capture and write theme style only once, then ignore subsequent updates for that styleId. */
  enableThemeCaptureOnce?: boolean;
};
