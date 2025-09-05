import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { updateStyleSheet } from './update-style-sheet.utils'

describe('updateStyleSheet', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('updates a CSS file using PostCSS', () => {
    const filePath = 'src/styles.css'
    tree.write(filePath, `body { color: black; }`)

    updateStyleSheet(tree, filePath, (root) => {
      root.walkDecls('color', (decl) => {
        decl.value = 'blue'
      })
      return root.toString()
    })

    const result = tree.read(filePath, 'utf-8')
    expect(result).toContain('color: blue')
  })

  it('compiles and updates a SCSS file with inline comment', () => {
    const filePath = 'src/styles.scss'
    tree.write(filePath, `$primary: red; body { color: $primary; } // some comment`)

    updateStyleSheet(tree, filePath, (root) => {
      root.walkDecls('color', (decl) => {
        decl.value = 'green'
      })
      return root.toString()
    })

    const result = tree.read(filePath, 'utf-8')
    expect(result).toContain('color: green')
  })

  it('compiles and updates SCSS with import', () => {
    const filePath = 'src/styles.scss'
    tree.write(
      filePath,
      `@import '/src/app/some_mixins.scss';
      $primary: red; body { color: $primary; }`
    )

    updateStyleSheet(tree, filePath, (root) => {
      root.walkDecls('color', (decl) => {
        decl.value = 'green'
      })
      return root.toString()
    })

    const result = tree.read(filePath, 'utf-8')
    expect(result).toContain('color: green')
  })

  it('does not write if content is unchanged', () => {
    const filePath = 'src/unchanged.css'
    const original = `body { margin: 0; }`
    tree.write(filePath, original)

    updateStyleSheet(tree, filePath, (root) => root.toString())

    const result = tree.read(filePath, 'utf-8')
    expect(result).toEqual(original)
  })
})
