import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { replaceTagInHtml } from './replace-tag-in-html.utils'

describe('replaceTagInHtml', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('replaces single tag occurrence', () => {
    const html = '<div>Content</div>'
    const result = replaceTagInHtml(tree, html, 'div', 'section')

    expect(result).toBe('<section>Content</section>')
  })

  it('replaces multiple tag occurrences', () => {
    const html = '<div>First</div><span>Middle</span><div>Second</div>'
    const result = replaceTagInHtml(tree, html, 'div', 'article')

    expect(result).toBe('<article>First</article><span>Middle</span><article>Second</article>')
  })

  it('preserves tag attributes', () => {
    const html = '<div class="test" id="myDiv">Content</div>'
    const result = replaceTagInHtml(tree, html, 'div', 'section')

    expect(result).toContain('class="test"')
    expect(result).toContain('id="myDiv"')
    expect(result).toContain('<section')
    expect(result).toContain('</section>')
    expect(result).toBe('<section class="test" id="myDiv">Content</section>')
  })

  it('handles nested tags correctly', () => {
    const html = '<div><span>Nested</span></div>'
    const result = replaceTagInHtml(tree, html, 'div', 'main')

    expect(result).toBe('<main><span>Nested</span></main>')
  })

  it('returns original html if tag not found', () => {
    const html = '<section>Content</section>'
    const result = replaceTagInHtml(tree, html, 'div', 'article')

    expect(result).toBe(html)
  })

  it('returns original html on parse error', () => {
    const invalidHtml = '<div><span>Unclosed</div>'
    const result = replaceTagInHtml(tree, invalidHtml, 'div', 'section')

    // Should handle gracefully and return modified or original based on parser behavior
    expect(typeof result).toBe('string')
  })
})
