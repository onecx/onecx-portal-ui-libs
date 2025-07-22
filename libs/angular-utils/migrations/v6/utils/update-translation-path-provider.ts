import { Tree } from "@nx/devkit"
import { ast, query, replace } from "@phenomnomnominal/tsquery"
import { isCallExpression, isObjectLiteralExpression, isPropertyAssignment, isStringLiteral, ScriptKind, SourceFile } from "typescript"
import { extractTranslationPath } from "./extract-translation-path";

// AST-based replacement of translation path provider
export function updateTranslationPathProvider(fileContent: string) {
 
  const astSource = ast(fileContent);
  const path = extractTranslationPath(astSource);

  // Remove provider with provide: TRANSLATION_PATH
  fileContent = replace(
    fileContent,
    'ArrayLiteralExpression > ObjectLiteralExpression:has(PropertyAssignment:has(Identifier[name="provide"]):has(Identifier[name="TRANSLATION_PATH"]))',
    () => `provideTranslationPathFromMeta(import.meta.url, ${path})`,
    ScriptKind.TS
  );

  // Remove trailing commas in providers arrays
  if (fileContent) {
    fileContent = fileContent.replace(/,\s*([\]\)])/g, '$1');
  }
  
  return fileContent;
}