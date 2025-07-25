import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { updateTranslationPathImports } from './utils/update-translation-path-imports';
import { updateTranslationPathProvider } from './utils/update-translation-path-provider';

export default async function replaceTranslationPathFactories(tree: Tree) {
  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    const fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;

  let updatedContent = updateTranslationPathImports(tree, filePath, fileContent);

  updatedContent = updateTranslationPathProvider(updatedContent);

  // Write back the result
  if (updatedContent) {
    tree.write(filePath, updatedContent);
  }
  });
}