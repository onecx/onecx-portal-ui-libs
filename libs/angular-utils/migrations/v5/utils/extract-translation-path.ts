import { query, SourceFile } from "@phenomnomnominal/tsquery";

export function extractTranslationPath(astSource: SourceFile): string | undefined {
  const queries = [
    'CallExpression[expression.name="remoteComponentTranslationPathFactory"] > StringLiteral',
    'CallExpression[expression.name="translationPathFactory"] > StringLiteral'
  ];

  for (const queryStr of queries) {
    const stringLiterals = query(astSource, queryStr);
    if (stringLiterals.length > 0) {
      return stringLiterals[0].getText();
    }
  }

  return undefined;
}
