import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { addGitignoreEntry, removeGitignoreEntry } from './update-gitignore.utils'

describe('update-gitignore.utils', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  describe('addGitignoreEntry', () => {
    it('should create .gitignore file if it does not exist', () => {
      addGitignoreEntry(tree, '/dist')

      expect(tree.exists('.gitignore')).toBe(true)
      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('/dist\n')
    })

    it('should add entry to existing .gitignore file', () => {
      tree.write('.gitignore', 'node_modules\n')

      addGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n/dist\n')
    })

    it('should not add duplicate entries', () => {
      tree.write('.gitignore', 'node_modules\n/dist\n')

      addGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n/dist\n')
    })

    it('should handle entries with different whitespace (normalization)', () => {
      tree.write('.gitignore', 'node_modules\n  /dist  \n')

      addGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n  /dist  \n')
    })

    it('should trim the entry before adding', () => {
      addGitignoreEntry(tree, '  /dist  ')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('/dist\n')
    })
    it('should handle .gitignore file with whitespace only', () => {
      tree.write('.gitignore', ' \n  ')

      addGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('\n/dist\n')
    })

    it('should add entry to .gitignore with existing content but no trailing newline', () => {
      tree.write('.gitignore', 'node_modules')

      addGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n/dist\n')
    })

    it('should handle .gitignore file that cannot be read (null content)', () => {
      // Mock a scenario where the file exists but cannot be read
      jest.spyOn(tree, 'read').mockReturnValue(null)
      tree.write('.gitignore', 'node_modules')

      // Should not throw an error and should not modify the file
      expect(() => addGitignoreEntry(tree, '/dist')).not.toThrow()
    })
  })

  describe('removeGitignoreEntry', () => {
    it('should do nothing if .gitignore does not exist', () => {
      removeGitignoreEntry(tree, '/dist')

      expect(tree.exists('.gitignore')).toBe(false)
    })

    it('should remove entry from .gitignore', () => {
      tree.write('.gitignore', 'node_modules\n/dist\n*.log\n')

      removeGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      // removeGitignoreEntry fügt immer ein \n am Ende hinzu
      expect(content).toBe('node_modules\n*.log\n\n')
    })

    it('should do nothing if entry does not exist', () => {
      const originalContent = 'node_modules\n*.log\n'
      tree.write('.gitignore', originalContent)

      removeGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe(originalContent)
    })

    it('should handle entries with different whitespace (normalization)', () => {
      tree.write('.gitignore', 'node_modules\n  /dist  \n*.log\n')

      removeGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n*.log\n\n')
    })

    it('should trim the entry before removing', () => {
      tree.write('.gitignore', 'node_modules\n/dist\n*.log\n')

      removeGitignoreEntry(tree, '  /dist  ')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n*.log\n\n')
    })

    it('should remove only the exact match (normalized)', () => {
      tree.write('.gitignore', 'node_modules\n/dist\n/dist-backup\n')

      removeGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n/dist-backup\n\n')
    })

    it('should remove entry and maintain proper line endings', () => {
      tree.write('.gitignore', 'node_modules\n/dist')

      removeGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n')
    })

    it('should handle .gitignore file that cannot be read (null content)', () => {
      // Mock a scenario where the file exists but cannot be read
      jest.spyOn(tree, 'read').mockReturnValue(null)
      tree.write('.gitignore', 'some content')

      // Should not throw an error and should not modify the file
      expect(() => removeGitignoreEntry(tree, '/dist')).not.toThrow()
    })

    it('should handle single line .gitignore without newline', () => {
      tree.write('.gitignore', '/dist')

      removeGitignoreEntry(tree, '/dist')

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('\n')
    })
  })
  describe('integration tests', () => {
    it('should add and then remove entry correctly', () => {
      addGitignoreEntry(tree, '/dist')
      addGitignoreEntry(tree, 'node_modules')

      let content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('/dist\nnode_modules\n')

      removeGitignoreEntry(tree, '/dist')

      content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('node_modules\n\n')
    })

    it('should handle multiple operations on same entry', () => {
      addGitignoreEntry(tree, '/dist')
      addGitignoreEntry(tree, '/dist') // Should not duplicate
      removeGitignoreEntry(tree, '/dist')
      removeGitignoreEntry(tree, '/dist') // Should not error

      const content = tree.read('.gitignore', 'utf-8')
      expect(content).toBe('\n')
    })
  })
})
