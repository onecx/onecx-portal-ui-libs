import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { hasHtmlTag } from './has-html-tag.utils'

describe('has-html-tag.utils', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  describe('hasHtmlTag', () => {
    it('should return true when tag exists in HTML string', () => {
      const html = '<div><p>Hello</p></div>'

      const result = hasHtmlTag(tree, html, 'p')

      expect(result).toBe(true)
    })

    it('should return false when tag does not exist in HTML string', () => {
      const html = '<div><p>Hello</p></div>'

      const result = hasHtmlTag(tree, html, 'span')

      expect(result).toBe(false)
    })

    it('should return true when tag exists in HTML file', () => {
      tree.write('src/app/component.html', '<div><button>Click me</button></div>')

      const result = hasHtmlTag(tree, 'src/app/component.html', 'button')

      expect(result).toBe(true)
    })

    it('should return false when tag does not exist in HTML file', () => {
      tree.write('src/app/component.html', '<div><p>Content</p></div>')

      const result = hasHtmlTag(tree, 'src/app/component.html', 'button')

      expect(result).toBe(false)
    })

    it('should return false when HTML file does not exist', () => {
      const result = hasHtmlTag(tree, 'non-existent.html', 'div')

      expect(result).toBe(false)
    })

    it('should return false when HTML file is empty', () => {
      tree.write('src/empty.html', '')

      const result = hasHtmlTag(tree, 'src/empty.html', 'div')

      expect(result).toBe(false)
    })

    it('should handle self-closing tags', () => {
      const html = '<div><img src="test.jpg" /><br /></div>'

      expect(hasHtmlTag(tree, html, 'img')).toBe(true)
      expect(hasHtmlTag(tree, html, 'br')).toBe(true)
    })

    it('should handle empty tag name', () => {
      const html = '<div><p>Hello</p></div>'

      const result = hasHtmlTag(tree, html, '')

      expect(result).toBe(false)
    })
  })
})
