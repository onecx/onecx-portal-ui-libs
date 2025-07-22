import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { removeImportSpecifierFromImport } from './remove-import-specifier.utils';

describe('removeImportSpecifierFromImport', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('removes a named import and leaves others intact', () => {
    const filePath = 'src/test.ts';
    tree.write(
      filePath,
      `import { testImport, testImport2 } from 'ngrx-accelerator';`
    );
    removeImportSpecifierFromImport(tree, filePath, 'ngrx-accelerator', 'testImport');
    const result = tree.read(filePath, 'utf-8');
    expect(result).toEqualIgnoringWhitespace(`import { testImport2 } from 'ngrx-accelerator';
      @NgModule()`);
  });

  it('removes the entire import if it was the only specifier', () => {
    const filePath = 'src/test2.ts';
    tree.write(
      filePath,
      `import { testImport } from 'ngrx-accelerator';`
    );
    removeImportSpecifierFromImport(tree, filePath, 'ngrx-accelerator', 'testImport');
    const result = tree.read(filePath, 'utf-8');
    expect(result).toEqualIgnoringWhitespace(`export class Test {}`)
  });

  it('does nothing if the specifier is not present', () => {
    const filePath = 'src/test3.ts';
    tree.write(
      filePath,
      `import { testImport2, testImport3 } from 'ngrx-accelerator';
      export class Test {}`
    );
    removeImportSpecifierFromImport(tree, filePath, 'ngrx-accelerator', 'testImport');
    const result = tree.read(filePath, 'utf-8');
    expect(result).toEqualIgnoringWhitespace(`import { testImport2, testImport3 } from 'ngrx-accelerator';
      export class Test {}`)
  });
});
