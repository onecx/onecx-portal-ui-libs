export function normalizeForHash(css: string, normalize: boolean): string {
  if (!normalize) return css;
  return css
    .replace(/\/\*[^]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export function isPrimeReactStyle(el: Element): boolean {
  return (
    el.tagName === 'STYLE' &&
    !el.hasAttribute('data-app-primereact-style') &&
    (el.hasAttribute('data-primereact-style-id') ||
      el.id?.startsWith('primereact_'))
  );
}

export function getStyleFromNode(n: Node): HTMLStyleElement | null {
  if (n.nodeType === Node.ELEMENT_NODE && isPrimeReactStyle(n as Element))
    return n as HTMLStyleElement;
  if (n.nodeType === Node.TEXT_NODE) {
    const p = n.parentNode as Element | null;
    if (p && isPrimeReactStyle(p)) return p as HTMLStyleElement;
  }
  return null;
}

export function shouldInclude(
  styleId: string,
  css: string,
  alwaysIncludeStyleIds: string[],
  prefixFilter?: string,
): boolean {
  if (alwaysIncludeStyleIds.includes(styleId)) return true;
  if (!prefixFilter) return true;
  return css.includes(`--${prefixFilter}-`);
}

export function scopeCss(
  css: string,
  scopeRootSelector: string,
  scopeLimitSelector?: string,
): string {
  const prelude = scopeLimitSelector
    ? `@scope(${scopeRootSelector}) to (${scopeLimitSelector})`
    : `@scope(${scopeRootSelector})`;
  const body = css.replace(/\:root\b/g, ':scope');
  return `${prelude}{\n${body}\n}\n`;
}
