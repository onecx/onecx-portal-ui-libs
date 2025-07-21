// import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
// import { replaceInFile } from 'nx-migration-utils'
// /**
//  * Migration to replace all TRANSLATION_PATH providers with provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/')
//  * and update imports accordingly.
//  */
// export default async function replaceTranslationPathFactories(tree: Tree) {
//     const srcDirectoryPath = 'src'

//     visitNotIgnoredFiles(tree, '.', (filePath) => {
//     if (!filePath.endsWith('.ts')) return
//     const fileContent = tree.read(filePath, 'utf-8')
//     if (!fileContent) return

//     // Replace provider object for TRANSLATION_PATH (useValue, translationPathFactory, remoteComponentTranslationPathFactory)
//     // Handles all test cases in the spec
//     replaceInFile(
//       tree,
//       filePath,
//       // Match provider object for TRANSLATION_PATH with useValue or useFactory
//       `ObjectLiteralExpression:has(PropertyAssignment > Identifier[name="provide"] ~ Identifier[name="TRANSLATION_PATH"]):has(PropertyAssignment > Identifier[name="useValue"]),
//        ObjectLiteralExpression:has(PropertyAssignment > Identifier[name="provide"] ~ Identifier[name="TRANSLATION_PATH"]):has(PropertyAssignment > Identifier[name="useFactory"] ~ ArrowFunction > CallExpression > Identifier[name="translationPathFactory"]),
//        ObjectLiteralExpression:has(PropertyAssignment > Identifier[name="provide"] ~ Identifier[name="TRANSLATION_PATH"]):has(PropertyAssignment > Identifier[name="useFactory"] ~ ArrowFunction > CallExpression > Identifier[name="remoteComponentTranslationPathFactory"])`,
//       'provideTranslationPathFromMeta(import.meta.url, \u0027assets/i18n/\u0027)'
//     )

//     // Remove deprecated imports and add provideTranslationPathFromMeta if needed
//     replaceInFile(
//       tree,
//       filePath,
//       `ImportDeclaration:has(StringLiteral[value="@onecx/angular-utils"]) ImportSpecifier:has(Identifier[name="TRANSLATION_PATH"])`,
//       ''
//     )
//     replaceInFile(
//       tree,
//       filePath,
//       `ImportDeclaration:has(StringLiteral[value="@onecx/angular-utils"]) ImportSpecifier:has(Identifier[name="translationPathFactory"])`,
//       ''
//     )
//     replaceInFile(
//       tree,
//       filePath,
//       `ImportDeclaration:has(StringLiteral[value="@onecx/angular-utils"]) ImportSpecifier:has(Identifier[name="remoteComponentTranslationPathFactory"])`,
//       ''
//     )
//     // Add provideTranslationPathFromMeta to import if not present
//     if (
//       fileContent.includes("@onecx/angular-utils") &&
//       !fileContent.includes('provideTranslationPathFromMeta')
//     ) {
//       replaceInFile(
//         tree,
//         filePath,
//         `ImportDeclaration:has(StringLiteral[value="@onecx/angular-utils"])`,
//         (match) => {
//           // Insert provideTranslationPathFromMeta into the import specifiers
//           return match.replace('{', '{ provideTranslationPathFromMeta,')
//         }
//       )
//     }
//   })
// }