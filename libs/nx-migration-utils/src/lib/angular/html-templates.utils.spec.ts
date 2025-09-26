import { Tree } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { ast } from '@phenomnomnominal/tsquery'
import {
  replaceTagInAngularTemplates,
  replaceTagInInlineAndExternalTemplate,
  replaceTagInInlineTemplates,
  replaceTagInExternalTemplates,
  getInlineTemplateNodes,
  getExternalTemplatePaths,
} from './html-templates.utils'

describe('html-templates.utils', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  describe('replaceTagInAngularTemplates', () => {
    it('should replace tags in TypeScript files with inline templates', () => {
      tree.write(
        '/src/component1.ts',
        `
        @Component({
          selector: 'app-test1',
          template: \`<p-button>Click me</p-button>\`
        })
        export class TestComponent1 {}
      `
      )

      tree.write(
        '/src/component2.ts',
        `
        @Component({
          selector: 'app-test2',
          template: \`
            <div>
              <p-button label="Save">Save</p-button>
              <p-button label="Cancel">Cancel</p-button>
            </div>
          \`
        })
        export class TestComponent2 {}
      `
      )

      tree.write(
        '/src/service.ts',
        `
        @Injectable()
        export class TestService {}
      `
      )

      replaceTagInAngularTemplates(tree, '/src', 'p-button', 'p-btn')

      const component1Content = tree.read('/src/component1.ts', 'utf-8')
      const component2Content = tree.read('/src/component2.ts', 'utf-8')
      const serviceContent = tree.read('/src/service.ts', 'utf-8')

      expect(component1Content).toContain('<p-btn>Click me</p-btn>')
      expect(component1Content).not.toContain('<p-button>')

      expect(component2Content).toContain('<p-btn label="Save">Save</p-btn>')
      expect(component2Content).toContain('<p-btn label="Cancel">Cancel</p-btn>')
      expect(component2Content).not.toContain('<p-button>')

      // Service should remain unchanged
      expect(serviceContent).not.toContain('<p-btn>')
    })

    it('should replace tags in external template files', () => {
      tree.write(
        '/src/component.ts',
        `
        @Component({
          selector: 'app-test',
          templateUrl: './component.html'
        })
        export class TestComponent {}
      `
      )

      tree.write(
        '/src/component.html',
        `<div>
          <p-button label="Submit">Submit</p-button>
          <p-button label="Reset">Reset</p-button>
        </div>`
      )

      replaceTagInAngularTemplates(tree, '/src', 'p-button', 'p-btn')

      const htmlContent = tree.read('/src/component.html', 'utf-8')
      expect(htmlContent).toContain('<p-btn label="Submit">Submit</p-btn>')
      expect(htmlContent).toContain('<p-btn label="Reset">Reset</p-btn>')
      expect(htmlContent).not.toContain('<p-button>')
    })

    it('should handle components with both inline and external templates', () => {
      tree.write(
        '/src/inline-component.ts',
        `
        @Component({
          selector: 'app-inline',
          template: \`<p-button>Inline</p-button>\`
        })
        export class InlineComponent {}
      `
      )

      tree.write(
        '/src/external-component.ts',
        `
        @Component({
          selector: 'app-external',
          templateUrl: './external.html'
        })
        export class ExternalComponent {}
      `
      )

      tree.write('/src/external.html', '<p-button>External</p-button>')

      replaceTagInAngularTemplates(tree, '/src', 'p-button', 'p-btn')

      const inlineContent = tree.read('/src/inline-component.ts', 'utf-8')
      const externalHtml = tree.read('/src/external.html', 'utf-8')

      expect(inlineContent).toContain('<p-btn>Inline</p-btn>')
      expect(externalHtml).toContain('<p-btn>External</p-btn>')
    })

    it('should skip files without target tag', () => {
      tree.write(
        '/src/component.ts',
        `@Component({
          selector: 'app-test',
          template: \`<div>No target tags here</div>\`
        })
        export class TestComponent {}`
      )

      replaceTagInAngularTemplates(tree, '/src', 'p-button', 'p-btn')
      const modifiedContent = tree.read('/src/component.ts', 'utf-8')

      // Check that no tags were replaced (content should still contain the original template)
      expect(modifiedContent).toContain('<div>No target tags here</div>')
      expect(modifiedContent).not.toContain('<p-btn>')
      expect(modifiedContent).not.toContain('<p-button>')
    })

    it('should handle empty directory gracefully', () => {
      expect(() => {
        replaceTagInAngularTemplates(tree, '/empty-dir', 'p-button', 'p-btn')
      }).not.toThrow()
    })

    it('should skip non-TypeScript files', () => {
      tree.write('/src/component.html', '<p-button>Should not be processed</p-button>')
      tree.write('/src/script.js', 'console.log("js file")')
      tree.write('/src/styles.css', '.p-button { color: red; }')

      const originalHtml = tree.read('/src/component.html', 'utf-8')

      replaceTagInAngularTemplates(tree, '/src', 'p-button', 'p-btn')

      const modifiedHtml = tree.read('/src/component.html', 'utf-8')
      expect(modifiedHtml).toBe(originalHtml)
    })
  })

  describe('replaceTagInInlineAndExternalTemplate', () => {
    it('should process file with inline template', () => {
      tree.write(
        '/src/component.ts',
        `
        @Component({
          selector: 'app-test',
          template: \`<p-button>Click</p-button>\`
        })
        export class TestComponent {}
      `
      )

      replaceTagInInlineAndExternalTemplate(tree, '/src/component.ts', 'p-button', 'p-btn')

      const content = tree.read('/src/component.ts', 'utf-8')
      expect(content).toContain('<p-btn>Click</p-btn>')
    })

    it('should process file with external template', () => {
      tree.write(
        '/src/component.ts',
        `
        @Component({
          selector: 'app-test',
          templateUrl: './template.html'
        })
        export class TestComponent {}
      `
      )

      tree.write('/src/template.html', '<p-button>External</p-button>')

      replaceTagInInlineAndExternalTemplate(tree, '/src/component.ts', 'p-button', 'p-btn')

      const htmlContent = tree.read('/src/template.html', 'utf-8')
      expect(htmlContent).toContain('<p-btn>External</p-btn>')
    })

    it('should handle non-existent file gracefully', () => {
      expect(() => {
        replaceTagInInlineAndExternalTemplate(tree, '/src/non-existent.ts', 'p-button', 'p-btn')
      }).not.toThrow()
    })

    it('should handle file with malformed TypeScript gracefully', () => {
      tree.write('/src/malformed.ts', 'this is not valid typescript {{{')

      expect(() => {
        replaceTagInInlineAndExternalTemplate(tree, '/src/malformed.ts', 'p-button', 'p-btn')
      }).not.toThrow()
    })
  })

  describe('replaceTagInInlineTemplates', () => {
    it('should replace tags in template literals', () => {
      tree.write(
        '/src/component.ts',
        `
        @Component({
          template: \`
            <div>
              <p-button>Button 1</p-button>
              <p-button>Button 2</p-button>
            </div>
          \`
        })
        export class TestComponent {}
      `
      )

      replaceTagInInlineTemplates(tree, '/src/component.ts', 'p-button', 'p-btn')

      const content = tree.read('/src/component.ts', 'utf-8')
      expect(content).toContain('<p-btn>Button 1</p-btn>')
      expect(content).toContain('<p-btn>Button 2</p-btn>')
      expect(content).not.toContain('<p-button>')
    })

    it('should not replace tags in string literals (only template literals supported)', () => {
      tree.write(
        '/src/component.ts',
        `
        @Component({
          template: '<p-button label="Click">Submit</p-button>'
        })
        export class TestComponent {}
      `
      )

      replaceTagInInlineTemplates(tree, '/src/component.ts', 'p-button', 'p-btn')
      const content = tree.read('/src/component.ts', 'utf-8')

      // Should remain unchanged because string literals are not supported
      expect(content).toContain('<p-button label="Click">Submit</p-button>')
      expect(content).not.toContain('<p-btn>')
    })

    it('should not modify file without target tags', () => {
      const originalContent = `@Component({
          template: \`<div>No buttons here</div>\`
        })
        export class TestComponent {}`
      tree.write('/src/component.ts', originalContent)

      replaceTagInInlineTemplates(tree, '/src/component.ts', 'p-button', 'p-btn')

      const content = tree.read('/src/component.ts', 'utf-8')
      // Since no target tags exist, check that the original template content remains
      expect(content).toContain('<div>No buttons here</div>')
      expect(content).not.toContain('<p-btn>')
      expect(content).not.toContain('<p-button>')
    })

    it('should handle file that does not exist', () => {
      expect(() => {
        replaceTagInInlineTemplates(tree, '/src/non-existent.ts', 'p-button', 'p-btn')
      }).not.toThrow()
    })
  })

  describe('replaceTagInExternalTemplates', () => {
    it('should replace tags in external template files', () => {
      tree.write(
        '/src/component.ts',
        `
        @Component({
          selector: 'app-test',
          templateUrl: './template.html'
        })
        export class TestComponent {}
      `
      )

      tree.write('/src/template.html', '<p-button>External Button</p-button>')

      const tsContent = tree.read('/src/component.ts', 'utf-8')!
      const contentAst = ast(tsContent)

      replaceTagInExternalTemplates(tree, '/src/component.ts', contentAst, 'p-button', 'p-btn')

      const htmlContent = tree.read('/src/template.html', 'utf-8')
      expect(htmlContent).toContain('<p-btn>External Button</p-btn>')
      expect(htmlContent).not.toContain('<p-button>')
    })

    it('should handle relative paths correctly', () => {
      tree.write(
        '/src/components/feature/component.ts',
        `
        @Component({
          templateUrl: '../shared/template.html'
        })
        export class TestComponent {}
      `
      )

      tree.write('/src/components/shared/template.html', '<p-button>Shared</p-button>')

      const tsContent = tree.read('/src/components/feature/component.ts', 'utf-8')!
      const contentAst = ast(tsContent)

      replaceTagInExternalTemplates(tree, '/src/components/feature/component.ts', contentAst, 'p-button', 'p-btn')

      const htmlContent = tree.read('/src/components/shared/template.html', 'utf-8')
      expect(htmlContent).toContain('<p-btn>Shared</p-btn>')
    })

    it('should skip files without target tags', () => {
      tree.write(
        '/src/component.ts',
        `
        @Component({
          templateUrl: './template.html'
        })
        export class TestComponent {}
      `
      )

      const originalHtml = '<div>No target tags</div>'
      tree.write('/src/template.html', originalHtml)

      const tsContent = tree.read('/src/component.ts', 'utf-8')!
      const contentAst = ast(tsContent)

      replaceTagInExternalTemplates(tree, '/src/component.ts', contentAst, 'p-button', 'p-btn')

      const htmlContent = tree.read('/src/template.html', 'utf-8')
      expect(htmlContent).toBe(originalHtml)
    })

    it('should handle non-existent template files gracefully', () => {
      tree.write(
        '/src/component.ts',
        `
        @Component({
          templateUrl: './non-existent.html'
        })
        export class TestComponent {}
      `
      )

      const tsContent = tree.read('/src/component.ts', 'utf-8')!
      const contentAst = ast(tsContent)

      expect(() => {
        replaceTagInExternalTemplates(tree, '/src/component.ts', contentAst, 'p-button', 'p-btn')
      }).not.toThrow()
    })
  })

  describe('getInlineTemplateNodes', () => {
    it('should extract inline template nodes from AST', () => {
      const tsContent = `
        @Component({
          template: \`<p-button>Test</p-button>\`
        })
        export class TestComponent {}
      `

      const contentAst = ast(tsContent)
      const nodes = getInlineTemplateNodes(contentAst)

      expect(nodes).toHaveLength(1)
      expect(nodes[0].getText()).toContain('<p-button>Test</p-button>')
    })

    it('should return empty array when no inline templates found', () => {
      const tsContent = `
        @Component({
          templateUrl: './template.html'
        })
        export class TestComponent {}
      `

      const contentAst = ast(tsContent)
      const nodes = getInlineTemplateNodes(contentAst)

      expect(nodes).toHaveLength(0)
    })

    it('should extract multiple template nodes if present', () => {
      const tsContent = `
        @Component({
          template: \`<p-button>Test 1</p-button>\`
        })
        export class TestComponent1 {}

        @Component({
          template: \`<p-button>Test 2</p-button>\`
        })
        export class TestComponent2 {}
      `

      const contentAst = ast(tsContent)
      const nodes = getInlineTemplateNodes(contentAst)

      expect(nodes).toHaveLength(2)
    })

    it('should not extract template nodes from string literals (only template literals)', () => {
      const tsContent = `
        @Component({
          template: '<p-button>Test</p-button>'
        })
        export class TestComponent {}
      `

      const contentAst = ast(tsContent)
      const nodes = getInlineTemplateNodes(contentAst)

      expect(nodes).toHaveLength(0)
    })
  })

  describe('getExternalTemplatePaths', () => {
    it('should extract external template paths from AST', () => {
      const tsContent = `
        @Component({
          templateUrl: './template.html'
        })
        export class TestComponent {}
      `

      const contentAst = ast(tsContent)
      const paths = getExternalTemplatePaths(contentAst, '/src/component.ts')

      expect(paths).toEqual(['/src/template.html'])
    })

    it('should resolve relative paths correctly', () => {
      const tsContent = `
        @Component({
          templateUrl: '../shared/template.html'
        })
        export class TestComponent {}
      `

      const contentAst = ast(tsContent)
      const paths = getExternalTemplatePaths(contentAst, '/src/components/component.ts')

      expect(paths).toEqual(['/src/shared/template.html'])
    })

    it('should handle multiple template URLs', () => {
      const tsContent = `
        @Component({
          templateUrl: './template1.html'
        })
        export class TestComponent1 {}

        @Component({
          templateUrl: './template2.html'
        })
        export class TestComponent2 {}
      `

      const contentAst = ast(tsContent)
      const paths = getExternalTemplatePaths(contentAst, '/src/component.ts')

      expect(paths).toEqual(['/src/template1.html', '/src/template2.html'])
    })

    it('should return empty array when no external templates found', () => {
      const tsContent = `
        @Component({
          template: '<div>Inline template</div>'
        })
        export class TestComponent {}
      `

      const contentAst = ast(tsContent)
      const paths = getExternalTemplatePaths(contentAst, '/src/component.ts')

      expect(paths).toEqual([])
    })

    it('should handle complex relative paths', () => {
      const tsContent = `
        @Component({
          templateUrl: '../../shared/components/template.html'
        })
        export class TestComponent {}
      `

      const contentAst = ast(tsContent)
      const paths = getExternalTemplatePaths(contentAst, '/src/features/user/component.ts')

      expect(paths).toEqual(['/src/shared/components/template.html'])
    })
  })
})
