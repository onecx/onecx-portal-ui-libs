import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Guards for popup triggers (issue: popup trigger semantics).
 *
 * 1. A `p-button` host element has no role. Attributes such as aria-*, tabindex or key handlers on the host are
 *    invalid ARIA (axe aria-allowed-attr) and create a second tab stop. They belong on the inner native button
 *    (use the `pt` pass-through option `{ root: { ... } }`).
 * 2. Native buttons that toggle a popup menu must announce `aria-haspopup`.
 */
const componentsDir = join(__dirname)

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? htmlFiles(full) : full.endsWith('.html') ? [full] : []
  })
}

/** Returns the raw text of every opening tag with the given name (attribute values may contain '>' inside quotes). */
function openingTags(html: string, tag: string): string[] {
  const result: string[] = []
  const start = new RegExp(`<${tag}(?=[\\s>/])`, 'g')
  let match: RegExpExecArray | null
  while ((match = start.exec(html))) {
    let i = match.index + match[0].length
    let quote: string | null = null
    for (; i < html.length; i++) {
      const c = html[i]
      if (quote) {
        if (c === quote) quote = null
      } else if (c === '"' || c === "'") {
        quote = c
      } else if (c === '>') {
        break
      }
    }
    result.push(html.slice(match.index, i + 1))
  }
  return result
}

function attributeNames(tag: string): string[] {
  const names: string[] = []
  const attr = /(?:^|\s)([\[(]?[A-Za-z_@*][\w.\-:]*(?:\.[\w\-]+)*[\])]?(?:\.[\w-]+)*)(?=\s*=|\s|\/?>)/g
  // strip quoted values first so their content is not parsed as attributes
  const stripped = tag.replace(/"[^"]*"|'[^']*'/g, '""')
  let m: RegExpExecArray | null
  while ((m = attr.exec(stripped.replace(/^<[\w-]+/, '')))) names.push(m[1])
  return names
}

const forbiddenOnHost = /^(\[attr\.)?aria-|^\[?tabindex\]?$|^\(key(down|up|press)(\.|\))/i

describe('popup trigger guard', () => {
  const files = htmlFiles(componentsDir)

  it('scans the component templates', () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it('does not allow aria-*, tabindex or key handlers on a p-button host', () => {
    const offenders = files.flatMap((file) =>
      openingTags(readFileSync(file, 'utf8'), 'p-button').flatMap((tag) =>
        attributeNames(tag)
          .filter((name) => forbiddenOnHost.test(name))
          .map((name) => `${file.replace(componentsDir, '')}: ${name}`)
      )
    )
    expect(offenders).toEqual([])
  })

  it('detects offenders (self-test of the guard)', () => {
    const tag = openingTags(
      '<p-button tabindex="0" [attr.aria-expanded]="a > b" (keydown.enter)="x()" ariaLabel="ok"></p-button>',
      'p-button'
    )[0]
    expect(attributeNames(tag).filter((n) => forbiddenOnHost.test(n))).toEqual([
      'tabindex',
      '[attr.aria-expanded]',
      '(keydown.enter)',
    ])
  })

  it('requires aria-haspopup on native buttons that toggle a popup menu', () => {
    const offenders = files.flatMap((file) =>
      openingTags(readFileSync(file, 'utf8'), 'button')
        .filter((tag) => /\(click\)="[^"]*\bmenu\b/.test(tag) && !/aria-haspopup=/.test(tag))
        .map((tag) => `${file.replace(componentsDir, '')}: ${tag.slice(0, 60)}`)
    )
    expect(offenders).toEqual([])
  })
})
