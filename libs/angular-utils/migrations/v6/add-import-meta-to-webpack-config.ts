import { Tree, visitNotIgnoredFiles } from "@nx/devkit";
import { ast, query, replace, ScriptKind } from "@phenomnomnominal/tsquery";

export default async function addImportMetaToWebpackConfig(tree: Tree) {
  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('webpack.config.js')) return;
    let fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;

    const moduleExportsSelector =
      'ExpressionStatement:has(PropertyAccessExpression:has(Identifier[name=module]):has(Identifier[name=exports]))  > BinaryExpression  > ObjectLiteralExpression';

    // Find module.exports assignment 
    const astSource = ast(fileContent);
    const moduleExports = query(astSource, moduleExportsSelector);

    if (moduleExports.length === 0) return;

    // Check if module property with importMeta already exists
    const hasImportMeta = fileContent.includes('importMeta: false');
    if (hasImportMeta) return;

    // Add the property
    fileContent = replace(
      fileContent,
      moduleExportsSelector,
      (node) => {
        // Remove trailing comma if present
        let text = node.getText().replace(/,?\s*$/, '');
        if (text.endsWith('}')) {
          text = text.slice(0, -1) + ', module: { parser: { javascript: { importMeta: false } } } }';
        }
        return text;
      },
      ScriptKind.JS
    );

    tree.write(filePath, fileContent);
  });
}